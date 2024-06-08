import { defineConfig } from "@saftox-ui/twind";

import { animations } from "./animations";
import { defaultPreset } from "./presets/preset";
import { utilities } from "./utilities";

export * from "./colors";

export type * from "./types";
export type * from "./colors/types";

import deepMerge from "deepmerge";
import {
	darkLayout,
	defaultLayout,
	lightLayout,
} from "./utilities/default-layout";
import { DEFAULT_TRANSITION_DURATION } from "./utilities/transition";
import { kebabCase, mapKeys } from "./utils";

export const themeConfig = (
	{ presets = [], preflight = {}, ...userConfig },
	prefix = "saftox-ui",
) => {
	const baseLayouts = {
		light: {
			...defaultLayout,
			...lightLayout,
		},
		dark: {
			...defaultLayout,
			...darkLayout,
		},
	};

	const light = {
		layout: baseLayouts.light,
	};

	const dark = {
		layout: baseLayouts.dark,
	};

	const themes = {
		light,
		dark,
	};

	const preflightLayout: any = {
		".dark, [data-theme=dark]": {
			"color-scheme": "dark",
		},
		".light, [data-theme=light]": {
			"color-scheme": "light",
		},
	};

	for (const [themeName, { layout }] of Object.entries(themes)) {
		const cssSelector = `.${themeName}, [data-theme="${themeName}"]`;

		const flatLayout = layout
			? mapKeys(layout, (value, key) => kebabCase(key))
			: {};

		for (const [key, value] of Object.entries(flatLayout)) {
			if (!value) return;

			const layoutVariablePrefix = `--${prefix}-${key}`;

			if (typeof value === "object") {
				for (const [nestedKey, nestedValue] of Object.entries(value)) {
					const nestedLayoutVariable = `${layoutVariablePrefix}-${nestedKey}`;

					if (!preflightLayout[cssSelector]) {
						preflightLayout[cssSelector] = {};
					}
					preflightLayout[cssSelector]![nestedLayoutVariable] = nestedValue;
				}
			} else {
				// Handle opacity values and other singular layout values
				const formattedValue =
					layoutVariablePrefix.includes("opacity") && typeof value === "number"
						? value.toString().replace(/^0\./, ".")
						: value;

				if (!preflightLayout[cssSelector]) {
					preflightLayout[cssSelector] = {};
				}
				preflightLayout[cssSelector]![layoutVariablePrefix] = formattedValue;
			}
		}
	}

	return defineConfig({
		preflight: [
			{
				...preflightLayout,
			},
			preflight,
		],
		theme: {
			extend: {
				scale: {
					"80": "0.8",
					"85": "0.85",
				},
				height: {
					divider: `var(--${prefix}-divider-weight)`,
				},
				width: {
					divider: `var(--${prefix}-divider-weight)`,
				},
				fontSize: {
					tiny: [
						`var(--${prefix}-font-size-tiny)`,
						`var(--${prefix}-line-height-tiny)`,
					],
					small: [
						`var(--${prefix}-font-size-small)`,
						`var(--${prefix}-line-height-small)`,
					],
					medium: [
						`var(--${prefix}-font-size-medium)`,
						`var(--${prefix}-line-height-medium)`,
					],
					large: [
						`var(--${prefix}-font-size-large)`,
						`var(--${prefix}-line-height-large)`,
					],
				},
				borderRadius: {
					small: `var(--${prefix}-radius-small)`,
					medium: `var(--${prefix}-radius-medium)`,
					large: `var(--${prefix}-radius-large)`,
				},
				opacity: {
					hover: `var(--${prefix}-hover-opacity)`,
					disabled: `var(--${prefix}-disabled-opacity)`,
				},
				borderWidth: {
					small: `var(--${prefix}-border-width-small)`,
					medium: `var(--${prefix}-border-width-medium)`,
					large: `var(--${prefix}-border-width-large)`,
					1: "1px",
					1.5: "1.5px",
					3: "3px",
					5: "5px",
				},
				boxShadow: {
					small: `var(--${prefix}-box-shadow-small)`,
					medium: `var(--${prefix}-box-shadow-medium)`,
					large: `var(--${prefix}-box-shadow-large)`,
				},
				backgroundImage: {
					"stripe-gradient":
						"linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)",
				},
				transitionDuration: {
					0: "0ms",
					250: "250ms",
					400: "400ms",
					DEFAULT: DEFAULT_TRANSITION_DURATION,
				},
				transitionTimingFunction: {
					"soft-spring": "cubic-bezier(0.155, 1.105, 0.295, 1.12)",
				},
				...animations,
			},
		},
		rules: [
			...(Object.entries(utilities).map(([key, value]) => [key, value]) as []),
		],
		...userConfig,
		presets: [defaultPreset(), ...presets],
	});
};
