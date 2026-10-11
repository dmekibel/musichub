// A small piano-like synth and a look-ahead scheduler (Web Audio).
// The sound is ours: generated in the browser from public-domain notes, no recordings.

const LOOKAHEAD = 0.15;   // seconds scheduled ahead
const TICK_MS = 25;

export class Player {
  constructor(notes, { tempo = 66, endAt, onEnd } = {}) {
    this.notes = [...notes].sort((a, b) => a[0] - b[0]);
    this.tempo = tempo;
    this.endAt = endAt ?? Math.max(...notes.map((n) => n[0] + n[1]));
    this.onEnd = onEnd;
    this.ctx = null;
    this.playing = false;
    this.startPos = 0;      // position (16ths) at startTime
    this.startTime = 0;
    this.pausedPos = 0;
    this.next = 0;          // index of next note to schedule
    this.voices = [];
    this.timer = null;
  }

  get secPer16() { return 60 / this.tempo / 4; }

  ensureCtx() {
    if (this.ctx) return;
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
    comp.connect(ctx.destination);
    this.out = ctx.createGain(); this.out.gain.value = 0.9; this.out.connect(comp);
    // a soft room: generated impulse response
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx, 2.6, 2.4);
    const wet = ctx.createGain(); wet.gain.value = 0.2;
    this.bus = ctx.createGain(); this.bus.gain.value = 1;
    this.bus.connect(this.out); this.bus.connect(verb); verb.connect(wet); wet.connect(this.out);
  }

  pos() {
    if (!this.playing) return this.pausedPos;
    return this.startPos + Math.max(0, this.ctx.currentTime - this.startTime) / this.secPer16;
  }

  async play(from = this.pausedPos) {
    this.ensureCtx();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    if (from >= this.endAt) from = 0;
    this.playing = true;
    this.anchor(from);
    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), TICK_MS);
    this.tick();
  }

  anchor(from) {
    this.startPos = from;
    this.startTime = this.ctx.currentTime + 0.04;
    this.next = this.notes.findIndex((n) => n[0] >= from - 1e-6);
    if (this.next < 0) this.next = this.notes.length;
  }

  pause() {
    if (!this.playing) return;
    this.pausedPos = this.pos();
    this.playing = false;
    clearInterval(this.timer);
    this.silence(this.ctx.currentTime);
  }

  seek(pos) {
    pos = Math.max(0, Math.min(pos, this.endAt));
    if (this.playing) {
      this.silence(this.ctx.currentTime);
      this.anchor(pos);
    } else this.pausedPos = pos;
  }

  setTempo(bpm) {
    if (this.playing) {
      const p = this.pos(), now = this.ctx.currentTime;
      this.tempo = bpm;
      this.cancelFuture(now);     // notes already sounding keep ringing
      this.startPos = p; this.startTime = now;
      this.next = this.notes.findIndex((n) => n[0] >= p - 1e-6);
      if (this.next < 0) this.next = this.notes.length;
    } else this.tempo = bpm;
  }

  tick() {
    const ctx = this.ctx, horizon = ctx.currentTime + LOOKAHEAD;
    while (this.next < this.notes.length) {
      const [on, len, midi] = this.notes[this.next];
      const when = this.startTime + (on - this.startPos) * this.secPer16;
      if (when > horizon) break;
      if (when >= ctx.currentTime - 0.01) this.voice(midi, Math.max(when, ctx.currentTime), len * this.secPer16);
      this.next++;
    }
    const now = ctx.currentTime;
    this.voices = this.voices.filter((v) => v.end > now);
    if (this.pos() >= this.endAt + 6) {      // let the last chord ring, then stop
      this.pause();
      this.pausedPos = this.endAt;
      this.onEnd && this.onEnd();
    }
  }

  voice(midi, when, dur) {
    const ctx = this.ctx;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const low = Math.max(0, (84 - midi) / 48);           // 0 (high) .. 1 (low)
    const vel = 0.11 + 0.07 * low;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vel, when + 0.004);
    g.gain.setTargetAtTime(vel * 0.0001, when + 0.004, 0.35 + 1.5 * low);   // natural decay
    const off = when + Math.max(dur, 0.09);
    g.gain.setTargetAtTime(0, off, 0.07);                                    // damper
    const end = off + 0.5;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(9000, f * 9), when);
    lp.frequency.setTargetAtTime(Math.min(4000, f * 3), when, 0.25);
    lp.connect(g); g.connect(this.bus);
    const oscs = [];
    for (const [type, mult, amp, det] of [["sine", 1, 1, 0], ["triangle", 1, 0.35, 3], ["sine", 2, 0.22, -2], ["sine", 3, 0.06, 0]]) {
      const o = ctx.createOscillator();
      o.type = type; o.frequency.value = f * mult; o.detune.value = det;
      const a = ctx.createGain(); a.gain.value = amp;
      o.connect(a); a.connect(lp);
      o.start(when); o.stop(end);
      oscs.push(o);
    }
    this.voices.push({ g, oscs, when, end });
  }

  silence(now) {
    for (const v of this.voices) {
      v.g.gain.cancelScheduledValues(now);
      v.g.gain.setTargetAtTime(0, now, 0.02);
      for (const o of v.oscs) { try { o.stop(now + 0.15); } catch (e) {} }
    }
    this.voices = [];
  }

  cancelFuture(now) {
    const keep = [];
    for (const v of this.voices) {
      if (v.when > now) { for (const o of v.oscs) { try { o.stop(now); } catch (e) {} } v.g.disconnect(); }
      else keep.push(v);
    }
    this.voices = keep;
  }
}

function impulse(ctx, seconds, decay) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}
