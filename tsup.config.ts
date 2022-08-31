import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entryPoints: [
    "src/index.ts",
    "src/client/clientAppEnhance.ts",
    "src/client/clientConfig.ts",
    "src/client/engine.ts",
  ],
  format: ["cjs", "esm"],
  outDir: "lib",
  external: [/\.vue$/u, /^@internal/u],
  target: "node14",
});
