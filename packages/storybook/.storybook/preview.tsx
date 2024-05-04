import type { Preview } from "storybook-solidjs";

const preview: Preview["parameters"] = {
	layout: "centered",
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	darkMode: {
		current: "dark",
		stylePreview: true,
		darkClass: "dark",
		lightClass: "light",
		classTarget: "html",
	},
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
