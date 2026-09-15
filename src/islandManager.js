// Mounts React islands for [data-island] placeholders once they come near the
// viewport. Canvas backgrounds unmount again when they scroll far away so only
// the ones on screen keep drawing.
const loaders = {
  waves: () => import("./components/GradientWaves.jsx"),
  galaxy: () => import("./components/Galaxy.jsx"),
  topography: () => import("./components/Topography.jsx"),
  threads: () => import("./components/Threads.jsx"),
  particles: () => import("./components/Particles.jsx"),
  acid: () => import("./components/AcidSquares.jsx"),
  glitch: () => import("./components/LetterGlitch.jsx"),
  silk: () => import("./components/Silk.jsx"),
  pillar: () => import("./components/LightPillar.jsx"),
  heroTitle: () => import("./visuals/HeroTitle.jsx"),
  partTiles: () => import("./visuals/PartTiles.jsx"),
  magic: () => import("./visuals/MagicLineage.jsx"),
  attributes: () => import("./visuals/AttributeWheel.jsx"),
  nations: () => import("./visuals/NationMap.jsx"),
  eras: () => import("./visuals/EraTimeline.jsx"),
  turn: () => import("./visuals/TurnDemo.jsx"),
  fun: () => import("./visuals/FunModeGauge.jsx"),
  grades: () => import("./visuals/GradeLadder.jsx"),
};
const backgrounds = new Set(["waves", "galaxy", "topography", "threads", "particles", "acid", "glitch", "silk", "pillar"]);

export function mountIslands(root, getProps) {
  const live = new Map();
  let disposed = false;

  const mount = async (el) => {
    const token = {};
    live.set(el, { token, unmount: null });
    const name = el.dataset.island;
    const [{ mountIsland }, mod] = await Promise.all([
      import("./islands.jsx"),
      loaders[name](),
    ]);
    const entry = live.get(el);
    if (disposed || entry?.token !== token) return;
    entry.unmount = mountIsland(el, mod.default, getProps(name, el));
  };
  const unmount = (el) => {
    live.get(el)?.unmount?.();
    live.delete(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting && !live.has(target)) mount(target);
        else if (
          !isIntersecting &&
          backgrounds.has(target.dataset.island) &&
          live.has(target)
        )
          unmount(target);
      }
    },
    { rootMargin: "400px 0px" },
  );
  root
    .querySelectorAll("[data-island]")
    .forEach((el) => loaders[el.dataset.island] && observer.observe(el));

  return () => {
    disposed = true;
    observer.disconnect();
    [...live.keys()].forEach(unmount);
  };
}
