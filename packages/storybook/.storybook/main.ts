import solidjsDocgen from "@joshwooding/vite-plugin-react-docgen-typescript";
import type { StorybookConfig } from "@saftox-ui/storybook-solid-vite";

import { dirname, join } from "node:path";

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
		{
			name: getAbsolutePath("@storybook/addon-essentials"),
			options: {
				docs: false,
			},
		},
		getAbsolutePath("@storybook/addon-interactions"),
	],
	framework: {
		name: getAbsolutePath("@saftox-ui/storybook-solid-vite"),
		options: {},
	},
	docs: {
		autodocs: false,
	},
	typescript: {
		skipCompiler: true,
		check: false,
	},
	staticDirs: ["../public"],
	async viteFinal(config, { presets }) {
		if (config.build) {
			config.build!.target = "esnext";
		}
		// Add docgen plugin
		const { reactDocgenTypescriptOptions } = await presets.apply<any>(
			"typescript",
			{},
		);
		config.plugins?.push({
			enforce: "pre",
			...solidjsDocgen({
				...reactDocgenTypescriptOptions,
				savePropValueAsString: true,
			}),
		});
		config.assetsInclude = ["/sb-preview/runtime.js"];
		return {
			...config,
			optimizeDeps: undefined,
		};
	},

	core: {
		disableTelemetry: true,
	},
};
export default config;
