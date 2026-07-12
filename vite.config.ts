import { defineConfig, ResolvedConfig, normalizePath } from "vite";
import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
import banner from "vite-plugin-banner";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
	const type = mode.includes("plugin") ? "plugin" : "basic";
	const isDev = mode.includes("production") ? false : true;
	const sourceFile = type === "plugin" ? "./plugin.js" : "./index.js";
	const destinationFile = `abcjs-${type}${isDev ? "" : "-min"}.js`;
	const licenseFile = `abcjs-${type}${isDev ? "" : "-min"}.LICENSE`;

	return {
		plugins: [
			banner(
				`/*! abcjs-${type} v${pkg.version} Copyright © 2009-2024 Paul Rosen and Gregory Dyke (https://abcjs.net) */\n/*! For license information please see ${licenseFile} */`,
			),
			vitePluginCopyFile("LICENSE.md", licenseFile),
		],
		build: {
			target: "es2015",
			emptyOutDir: false,
			lib: {
				entry: sourceFile,
				formats: ["umd"],
				name: "ABCJS",
				fileName: () => destinationFile,
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

function vitePluginCopyFile(
	source: string,
	destination: string,
): import("vite").PluginOption {
	let output = false;
	let config: ResolvedConfig;
	return {
		name: "vite-plugin-static-copy",
		apply: "build",
		buildEnd() {
			// reset for watch mode
			output = false;
		},
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async writeBundle() {
			if (output) return;
			output = true;

			const outputFile = normalizePath(
				path.resolve(config.build.outDir || "dist", destination),
			);
			console.log(`Copying ${source} to ${outputFile}`);
			await fs.promises.copyFile(source, outputFile);
		},
	};
}
