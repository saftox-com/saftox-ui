import fs from "node:fs";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { solidPlugin } from "esbuild-plugin-solid";
import { defineConfig } from "tsup";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const { devDependencies } = packageJson;
const external = [...Object.keys({ ...devDependencies })];
const entry = ["src/index.ts", "src/preset.ts", "src/entry-preview.ts"];

export default defineConfig([
	{
		entry,
		outDir: "dist",
		format: ["esm"],
		target: ["chrome100", "safari15", "firefox91"],
		platform: "browser",
		external,
		esbuildPlugins: [polyfillNode(), solidPlugin()],
		esbuildOptions: (c) => {
			c.conditions = ["module"];
			c.platform = "browser";
		},
		dts: true,
		outExtension() {
			return {
				js: ".mjs",
			};
		},
	},
	{
		entry,
		outDir: "dist",
		format: ["cjs"],
		target: "node18",
		platform: "node",
		external,
		esbuildPlugins: [solidPlugin()],
		esbuildOptions: (c) => {
			c.platform = "node";
		},
		outExtension() {
			return {
				js: ".js",
			};
		},
	},
]);
