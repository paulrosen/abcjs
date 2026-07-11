import { defineConfig } from "vite";
import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import banner from "vite-plugin-banner";

export default defineConfig(({ command, mode }) => {
  const type = mode.includes("plugin") ? "plugin" : "basic";
  const isDev = mode.includes("production") ? false : true;

  return {
    plugins: [
      banner(
        `/*! abcjs_${type} v${pkg.version} Copyright © 2009-2024 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n/*! For license information please see abcjs_${type}.LICENSE */`,
      ),
    ],
    build: {
      target: "es2015",
      emptyOutDir: false,
      lib: {
        entry: [type === "plugin" ? "./plugin.js" : "./index.js"],
        formats: ["umd"],
        name: "ABCJS",
        fileName: () => `abcjs-${type}${isDev ? "" : "-min"}.js`,
      },
      minify: mode.includes("production") ? "terser" : false,
      sourcemap: mode.includes("development"),
      terserOptions: {
        compress: true,
        mangle: true,
      },
      rollupOptions: {
        output: {
          dir: "dist",
          format: "umd",
          name: "ABCJS",
          globals: {
            abcjs: "ABCJS",
          },
          assetFileNames: (assetInfo) => {
            return assetInfo.name || "";
          },
        },
        plugins: [commonjs()],
      },
    },
  };
});
