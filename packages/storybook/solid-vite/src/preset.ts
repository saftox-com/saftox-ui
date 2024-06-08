import type { PresetProperty } from "@storybook/types";
import type { StorybookConfig } from "./types";

import { dirname, join } from "node:path";
import { hasVitePlugins } from "@storybook/builder-vite";

const getAbsolutePath = <I extends string>(input: I): I =>
	dirname(require.resolve(join(input, "package.json"))) as any;

export const core: PresetProperty<"core", StorybookConfig> = {
	builder: getAbsolutePath("@storybook/builder-vite"),
	renderer: getAbsolutePath("@saftox-ui/storybook-solid"),
};

export const viteFinal: StorybookConfig["viteFinal"] = async (config) => {
	const { plugins = [] } = config;

	// Add solid plugin if not present
	if (!(await hasVitePlugins(plugins, ["vite-plugin-solid"]))) {
		const { default: solidPlugin } = await import("vite-plugin-solid");
		plugins.push(solidPlugin());

		// Docgen plugin is prioritized as first pluging to be loaded for having file raw code.
		// plugins.unshift(solidDocgen());
	}

	return config;
};
