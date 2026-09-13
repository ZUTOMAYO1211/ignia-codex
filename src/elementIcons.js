const names = ['fire', 'water', 'wind', 'earth', 'lightning', 'light', 'darkness', 'neutral'];
const glyphs = ['火', '水', '風', '土', '雷', '光', '暗', '無'];
export const elementIcon = (glyph) => {
  const index = glyphs.indexOf(glyph);
  return index < 0 ? undefined : `${import.meta.env.BASE_URL}assets/icons/${names[index]}.png`;
};
