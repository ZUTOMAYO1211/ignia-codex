// Mounts a React component into a plain DOM node so React Bits components can
// live inside the vanilla router. Returns a cleanup that unmounts it.
import { createRoot } from "react-dom/client";

export function mountIsland(container, Component, props = {}) {
  const root = createRoot(container);
  root.render(<Component {...props} />);
  return () => root.unmount();
}
