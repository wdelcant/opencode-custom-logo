import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

export default defineConfig({
  entry: ["src/config.ts", "src/tui.tsx"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  dts: true,
  clean: true,
  esbuildPlugins: [solidPlugin({ solid: { generate: "universal" } })],
});
