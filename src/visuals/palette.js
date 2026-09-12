// Each basic attribute keeps one hue across the site; dark mode lightens it in CSS.
const ELEMENT_COLORS = {
  火: "#c2462a",
  水: "#2f6fb8",
  風: "#2f7a5a",
  土: "#8a5a2f",
  雷: "#7a4fc0",
  光: "#a07a10",
  暗: "#4a4f8f",
  無: "#5d6573",
};

export const elementColor = (glyph) => ELEMENT_COLORS[glyph] ?? "#5d6573";

// Korean topic particle: 은 after a final consonant, 는 otherwise.
export const topic = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return word + (code >= 0 && code % 28 ? "은" : "는");
};
