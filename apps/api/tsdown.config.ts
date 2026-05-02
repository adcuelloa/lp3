import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/server.ts"],
  format: "esm",
  clean: true,
  sourcemap: true,
  target: "esnext",
  deps: {
    // Bundle workspace packages so Node never loads their dist (no .js extensions needed in source)
    alwaysBundle: [/^@project\/.*/],
    onlyBundle: ["uuidv7"],
  },
});
