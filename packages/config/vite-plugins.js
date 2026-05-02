/**
 * @module @project/config/vite-plugins
 * @summary Shared Vite plugins for all frontend apps
 */

/**
 * @summary Replaces lodash's `Function("return this")()` with `globalThis`
 * @description Lodash (bundled via recharts/other deps) uses `Function("return this")()`
 *   as a globalThis polyfill. This triggers CSP `script-src` violations because
 *   `Function(string)` is equivalent to `eval`. Since build target is es2022,
 *   `globalThis` is natively available — the polyfill is unnecessary.
 * @returns {import("vite").Plugin}
 */
export function cspSafeGlobalsPlugin() {
  return {
    name: "csp-safe-globals",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && fileName.endsWith(".js")) {
          chunk.code = chunk.code.replace(/Function\("return this"\)\(\)/g, "globalThis");
        }
      }
    },
  };
}
