import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "./",
  plugins: [react()],
  // Islands load React and effect libraries lazily; pre-bundling them keeps the
  // dev server from re-optimizing mid-session and loading two copies of React.
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-dev-runtime", "motion/react", "ogl"],
  },
});
