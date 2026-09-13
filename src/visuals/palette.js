// Each basic attribute keeps one hue across the site; dark mode lightens it in CSS.
const ELEMENT_COLORS = {
  火: "#a53d20",
  水: "#245f9f",
  風: "#326347",
  土: "#79532f",
  雷: "#6942a8",
  光: "#806314",
  暗: "#494d83",
  無: "#505865",
};

export const elementColor = (glyph) => ELEMENT_COLORS[glyph] ?? "#505865";

// Korean topic particle: 은 after a final consonant, 는 otherwise.
export const topic = (word) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return word + (code >= 0 && code % 28 ? "은" : "는");
};
