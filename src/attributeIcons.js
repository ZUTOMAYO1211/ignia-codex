const icons = new Map([
  ["연옥마법", ["evolved", "inferno"]],
  ["빙설마법", ["evolved", "ice-snow"]],
  ["폭풍마법", ["evolved", "tempest"]],
  ["대지마법", ["evolved", "great-earth"]],
  ["천둥마법", ["evolved", "thunder"]],
  ["광명마법", ["evolved", "radiance"]],
  ["심연마법", ["evolved", "abyss"]],
  ["뇌명마법", ["fusion", "thunderclap"]],
  ["혼돈마법", ["fusion", "chaos"]],
  ["모래마법", ["fusion", "sand"]],
  ["용암마법", ["fusion", "lava"]],
  ["폭발마법", ["fusion", "explosion"]],
  ["시간", ["special", "time"]],
  ["공간", ["special", "space"]],
  ["금속", ["special", "metal"]],
  ["환영", ["special", "illusion"]],
  ["정화", ["special", "purification"]],
  ["암영(그림자)", ["special", "shadow"]],
  ["맹독", ["special", "poison"]],
  ["진동", ["special", "vibration"]],
  ["연기", ["special", "smoke"]],
  ["영혼", ["special", "soul"]],
  ["중력", ["special", "gravity"]],
]);

export const attributeIcon = (name) => {
  const icon = icons.get(name);
  return icon
    ? `${import.meta.env.BASE_URL}assets/icons/${icon[0]}/${icon[1]}.webp?v=1`
    : null;
};
