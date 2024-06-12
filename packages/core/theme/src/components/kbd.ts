import type { VariantProps } from "@saftox-ui/variants";

import { tv } from "../utils/tv";

/**
 * Keyboard Key wrapper **Variants** component
 *
 * @example
 *
 * const { base, abbr, content } = kbd()
 *
 * <kbd class={base()} >
 *    <abbr title="Command" class={abbr()}>⌘</abbr>
 *    <abbr title="Shift" class={abbr()}>⇧</abbr>
 *    <abbr title="Control" class={abbr()}>⌃</abbr>
 *    <abbr title="Option" class={abbr()}>⌥</abbr>
 *    <abbr title="Enter" class={abbr()}>↵</abbr>
 *    <abbr title="Delete" class={abbr()}>⌫</abbr>
 *    <abbr title="Escape" class={abbr()}>⎋</abbr>
 *    <abbr title="Tab" class={abbr()}>⇥</abbr>
 *    <abbr title="Caps Lock" class={abbr()}>⇪</abbr>
 *    <abbr title="Up" class={abbr()}>↑</abbr>
 *    <abbr title="Right" class={abbr()}>→</abbr>
 *    <abbr title="Down" class={abbr()}>↓</abbr>
 *    <abbr title="Left" class={abbr()}>←</abbr>
 *    <abbr title="Page Up" class={abbr()}>⇞</abbr>
 *    <abbr title="Page Down" class={abbr()}>⇟</abbr>
 *    <abbr title="Home" class={abbr()}>↖</abbr>
 *    <abbr title="End" class={abbr()}>↘</abbr>
 *    <abbr title="Help" class={abbr()}>?</abbr>
 *    <abbr title="Space" class={abbr()}>␣</abbr>
 *    <span class={content()}>A</span>
 * </kbd>
 */
const kbd = tv({
	slots: {
		base: [
			"px-1.5",
			"py-0.5",
			"inline-flex",
			"space-x-0.5",
			"rtl:space-x-reverse",
			"items-center",
			"font-sans",
			"font-normal",
			"text-center",
			"text-small",
			"shadow-small",
			"bg-default-100",
			"text-foreground-600",
			"rounded-small",
		],
		abbr: "no-underline",
		content: "",
	},
	variants: {},
	defaultVariants: {},
});

export type KbdVariantProps = VariantProps<typeof kbd>;
export type KbdSlots = keyof ReturnType<typeof kbd>;

export { kbd };
