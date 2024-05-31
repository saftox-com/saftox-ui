import type { Preview } from "storybook-solidjs";

import * as React from "solid-js";
import { createEffect, createSignal } from "solid-js";

import { themeConfig } from "@saftox-ui/preset";
import { css, defineConfig, install } from "@saftox-ui/twind";

import { themes } from "@storybook/theming";

const isProd = process.env.NODE_ENV === "production";

install(
	themeConfig({
		preflight: css`
    body {
      @apply bg-background;
    },
  `,
		ignorelist: [/^((css|s?c|svelte|sb)-|(sprinkles)?_|go\d)|-sc-/, "dark"],
		hash: isProd,
	}),
);

const parameters: Preview["parameters"] = {
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

function ThemeWrapper(props: any) {
	const STORAGE_KEY = "sb-addon-themes-3";
	const storedItem = window.localStorage.getItem(STORAGE_KEY);
	const root = document.documentElement;

	const parseStoreColorItem =
		storedItem && JSON.parse(storedItem).current === "dark";

	const [isDark, setIsDark] = createSignal(parseStoreColorItem);

	addEventListener("storage", (event: any) => {
		if (event.key === STORAGE_KEY) {
			const isCurrentDark = JSON.parse(event.newValue).current === "dark";
			if (isDark() !== isCurrentDark) {
				setIsDark(isCurrentDark);
			}
		}
	});

	createEffect(() => {
		root.classList.toggle("dark", isDark() as boolean);
	});

	return props.children;
}
const locales = [
	"ar-AE",
	"bg-BG",
	"cs-CZ",
	"da-DK",
	"de-DE",
	"el-GR",
	"en-US",
	"es-ES",
	"et-EE",
	"fi-FI",
	"fr-FR",
	"he-IL",
	"hr-HR",
	"hu-HU",
	"it-IT",
	"ja-JP",
	"ko-KR",
	"lt-LT",
	"lv-LV",
	"nb-NO",
	"nl-NL",
	"pl-PL",
	"pt-BR",
	"pt-PT",
	"ro-RO",
	"ru-RU",
	"sk-SK",
	"sl-SI",
	"sr-SP",
	"sv-SE",
	"tr-TR",
	"uk-UA",
	"zh-CN",
	"zh-TW",
];

const globalTypes = {
	locale: {
		toolbar: {
			icon: "globe",
			items: locales.map((locale) => ({
				value: locale,
				title: new Intl.DisplayNames(undefined, { type: "language" }).of(
					locale,
				),
				right:
					// @ts-ignore
					new Intl.Locale(locale)?.textInfo?.direction === "rtl"
						? "Right to Left"
						: undefined,
			})),
		},
	},
};

const decorators: Preview["decorators"] = [
	(Story, { globals: { locale } }) => {
		const direction =
			// @ts-ignore
			locale && new Intl.Locale(locale)?.textInfo?.direction === "rtl"
				? "rtl"
				: undefined;

		return (
			<ThemeWrapper locale={locale}>
				<div lang={locale} dir={direction}>
					<Story />
				</div>
			</ThemeWrapper>
		);
	},
];

export default {
	decorators,
	parameters,
	globalTypes,
} satisfies Preview;
