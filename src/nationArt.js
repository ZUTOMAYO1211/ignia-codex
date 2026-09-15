const ids = new Set([
  "3-1",
  "3-2",
  "3-3",
  "3-4",
  "4-1",
  "4-2",
  "4-3",
  "4-4",
  "4-5",
  "4-7",
]);

export const nationArtwork = (id) =>
  ids.has(id) ? `${import.meta.env.BASE_URL}assets/nations/${id}.webp?v=1` : null;
