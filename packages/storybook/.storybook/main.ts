import type { StorybookConfig } from "storybook-solidjs-vite";

import { dirname, join, resolve } from "node:path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
	stories: [
		"../../components/**/stories/**/*.stories.@(js|jsx|ts|tsx)",
		"../../core/theme/stories/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		getAbsolutePath("storybook-dark-mode"),
		getAbsolutePath("@storybook/addon-a11y"),
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@chromatic-com/storybook"),
		getAbsolutePath("@storybook/addon-interactions"),
	],
	// staticDirs: ["../public"],
	framework: {
		name: getAbsolutePath("storybook-solidjs-vite"),
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	core: {
		disableTelemetry: true,
	},
};
export default config;
