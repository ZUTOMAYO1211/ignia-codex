// Draft emblems exist for every nation except 4-6, which is not a state.
const ids = new Set(["3-1", "3-2", "3-3", "3-4", "4-1", "4-2", "4-3", "4-4", "4-5", "4-7"]);

export const nationEmblem = (id) => (ids.has(id) ? `${import.meta.env.BASE_URL}assets/heraldry/${id}.webp?v=2` : null);
