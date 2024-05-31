import { defineConfig } from "@saftox-ui/twind";

import { animations } from "./animations";
import { defaultPreset } from "./presets/preset";
import { utilities } from "./utilities";

export * from "./colors";

export type * from "./types";
export type * from "./colors/types";

export const themeConfig = ({ presets = [], ...userConfig }) => {
	return defineConfig({
		theme: {
			extend: {
				spacingUnit: 4,
				hoverOpacity: ".9",
				disabledOpacity: ".5",
				dividerWeight: "1px",
				fontSize: {
					tiny: "0.75rem",
					small: "0.875rem",
					medium: "1rem",
					large: "1.125rem",
				},
				lineHeight: {
					tiny: "1rem",
					small: "1.25rem",
					medium: "1.5rem",
					large: "1.75rem",
				},
				radius: {
					small: "8px",
					medium: "12px",
					large: "14px",
				},
				borderWidth: {
					small: "1px",
					medium: "2px",
					large: "3px",
				},
				boxShadow: {
					small:
						"0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
					medium:
						"0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
					large:
						"0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
				},
				backgroundImage: {
					"stripe-gradient":
						"linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)",
				},
				transitionDuration: {
					0: "0ms",
					250: "250ms",
					400: "400ms",
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
