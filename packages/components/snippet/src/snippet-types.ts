import type { ButtonProps } from "@saftox-ui/button";
import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type {
	SlotsToClasses,
	SnippetSlots,
	SnippetVariantProps,
} from "@saftox-ui/theme";
import type { JSX, VoidComponent } from "solid-js";

export interface UseSnippetProps
	extends Omit<HTMLSaftoxUIProps, "onCopy" | "children">,
		SnippetVariantProps {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
	/**
	 * The content of the snippet.
	 * if `string[]` is passed, it will be rendered as a multi-line snippet.
	 */
	children?: JSX.Element;
	/**
	 * The symbol to show before the snippet.
	 * @default "$"
	 */
	symbol?: string | JSX.Element;
	/**
	 * The time in milliseconds to wait before resetting the clipboard.
	 * @default 2000
	 */
	timeout?: number;
	/*
	 * Snippet copy icon.
	 */
	copyIcon?: VoidComponent;
	/*
	 * Snippet copy icon. This icon will be shown when the text is copied.
	 */
	checkIcon?: VoidComponent;
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Snippet classes={{
	 *    base:"base-classes",
	 *    pre: "pre-classes",
	 *    copyButton: "copy-classes", // copy button classes
	 *    copyIcon: "copy-classes", // copy icon classes
	 *    checkIcon: "check-classes", // check icon classes
	 *    content: "content-classes", // content when is multiline
	 *    symbol: "symbol-classes", // symbol classes
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<SnippetSlots>;
	/**
	 * Whether the copy button should receive focus on render.
	 * @default false
	 */
	autofocus?: boolean;
	/**
	 * The code string to copy. if `codeString` is passed, it will be copied instead of the children.
	 */
	codeString?: string;
	/**
	 * Whether to hide the tooltip.
	 * @default false
	 */
	disableTooltip?: boolean;
	/**
	 * Whether to disable the copy functionality.
	 * @default false
	 */
	disableCopy?: boolean;
	/**
	 * Whether to hide the copy button.
	 * @default false
	 */
	hideCopyButton?: boolean;
	/**
	 * Whether to hide the symbol.
	 * @default false
	 */
	hideSymbol?: boolean;
	/**
	 * Copy button props.
	 * @default {
	 *   isDisabled: disableCopy,
	 *   onPress: onCopy
	 *   size:"sm",
	 *   variant:"light",
	 *   isIconOnly: true,
	 * }
	 */
	copyButtonProps?: Partial<ButtonProps>;
	/**
	 * Callback when the text is copied.
	 */
	onCopy?: (value: string | string[]) => void;
}

export interface SnippetProps extends UseSnippetProps {}
