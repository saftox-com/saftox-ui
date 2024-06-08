/* @refresh reload */

import type { Preview } from "@saftox-ui/storybook-solid";

import { createEffect, createSignal } from "solid-js";

import { themeConfig } from "@saftox-ui/preset";
import { css, install } from "@saftox-ui/twind";

import { themes } from "@storybook/theming";

import { SaftoxUIProvider } from "@saftox-ui/system";

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
	}) as any,
);

const commonTheme = {
	brandTitle: "Saftox UI",
};

const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	options: {
		storySort: {
			method: "alphabetical",
			order: ["Foundations", "Components"],
		},
	},
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
		dark: {
			...themes.dark,
			...commonTheme,
			appBg: "#161616",
			barBg: "black",
			background: "black",
			appContentBg: "black",
			appBorderRadius: 14,
			brandImage: "/dark-logo.svg",
		},
		light: {
			...themes.light,
			...commonTheme,
			appBorderRadius: 14,
			brandImage: "/light-logo.svg",
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
	disableAnimation: {
		name: "Disable Animation",
		description: "Disable all animations in the stories",
		toolbar: {
			icon: "photodrag",
			items: [
				{ value: true, title: "True" },
				{ value: false, title: "False" },
			],
		},
	},
};

const decorators: Preview["decorators"] = [
	(Story, { globals: { locale, disableAnimation } }) => {
		const direction =
			// @ts-ignore
			locale && new Intl.Locale(locale)?.textInfo?.direction === "rtl"
				? "rtl"
				: undefined;

		return (
			<SaftoxUIProvider locale={locale} disableAnimation={disableAnimation}>
				<ThemeWrapper locale={locale}>
					<div lang={locale} dir={direction}>
						<Story />
					</div>
				</ThemeWrapper>
			</SaftoxUIProvider>
		);
	},
];

export default {
	decorators,
	parameters,
	globalTypes,
} as Preview;
