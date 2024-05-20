import type { I18nProviderProps } from "@saftox-ui/i18n";
import type { DOMAttributes } from "@saftox-ui/system-ssc";
import type { Component, JSX } from "solid-js";

import { I18nProvider } from "@saftox-ui/i18n";
import { splitProps } from "solid-js";

export interface SaftoxUIProviderProps extends DOMAttributes {
	children: JSX.Element | JSX.Element[];
	/**
	 * The locale to apply to the children.
	 * @default "en-US"
	 */
	locale?: I18nProviderProps["locale"];
	/**
	 * Provides a client side router to all nested components such as
	 * Link, Menu, Tabs, Table, etc.
	 */
	navigate?: (path: string) => void;
}

export const SaftoxUIProvider: Component<SaftoxUIProviderProps> = (props) => {
	const [local, otherProps] = splitProps(props, ["locale", "navigate"]);

	return <I18nProvider locale={local.locale}>{props.children}</I18nProvider>;
};
