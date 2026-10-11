// Color as a musical dimension.
// "Note" mode gives each of the 12 pitch classes a hue, placed around the circle of fifths
// so related notes get neighboring hues (the logic behind Scriabin's and Malinowski's color
// keyboards). Hues are picked in OKLCH at one lightness and chroma, so no note looks louder
// than another just because yellow reads brighter than blue (ColorHub's color science).

const FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];   // C G D A E B F# C# G# D# A# F

export const NOTE_COLORS = (() => {
  const out = new Array(12);
  FIFTHS.forEach((pc, k) => { out[pc] = oklchToHex(0.76, 0.13, 25 + k * 30); });
  return out;
})();

export function oklchToHex(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => {
    v = Math.max(0, Math.min(1, v));
    v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(v * 255).toString(16).padStart(2, "0");
  });
  return `#${rgb.join("")}`;
}
