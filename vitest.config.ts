import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solidPlugin()],
	test: {
		include: ["packages/**/*.{test,spec}.{ts,tsx}"],
		environment: "jsdom",
		globals: true,
		setupFiles: ["node_modules/@testing-library/jest-dom/vitest"],
		// if you have few tests, try commenting this
		// out to improve performance:
		isolate: false,
	},
	build: {
		target: "esnext",
	},
	resolve: {
		conditions: ["development", "browser"],
	},
});
