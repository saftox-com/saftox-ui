import type { ButtonProps } from "@saftox-ui/button";
import type { PropGetter } from "@saftox-ui/system";
import type { UseSnippetProps } from "./snippet-types";

import {
	createSignal,
	mergeProps,
	children as resoleveChildren,
	splitProps,
} from "solid-js";

import { createFocusRing } from "@saftox-ui/focus";
import { clsx, dataAttr } from "@saftox-ui/shared-utils";
import { mergeRefs } from "@saftox-ui/solid-utils/reactivity";
import { mapPropsVariants, useProviderContext } from "@saftox-ui/system";
import { useClipboard } from "@saftox-ui/use-clipboard";
import { filterDOMProps } from "@saftox-ui/utils";

import { CheckLinearIcon, CopyLinearIcon } from "@saftox-ui/shared-icons";
import { snippet } from "@saftox-ui/theme";

export function useSnippet(originalProps: UseSnippetProps) {
	const globalContext = useProviderContext();
	const children = resoleveChildren(() => originalProps?.children);

	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		snippet.variantKeys,
	);

	const defaultProps: UseSnippetProps = {
		symbol: "$",
		copyIcon: CopyLinearIcon,
		checkIcon: CheckLinearIcon,
		disableCopy: false,
		disableTooltip: false,
		hideCopyButton: false,
		autofocus: false,
		hideSymbol: false,
		copyButtonProps: {},
	};

	const props = mergeProps(defaultProps, omitVariantProps);

	const [local, rest] = splitProps(props, [
		"ref",
		"as",
		"class",
		"classes",
		"symbol",
		"timeout",
		"copyIcon",
		"checkIcon",
		"codeString",
		"disableCopy",
		"disableTooltip",
		"hideCopyButton",
		"autofocus",
		"hideSymbol",
		"onCopy",
		"copyButtonProps",
	]);

	const Component = local.as || "div";
	const shouldFilterDOMProps = typeof Component === "string";

	const [domRef, setDomRef] = createSignal<HTMLElement>();
	const [preRef, setPreRef] = createSignal<HTMLPreElement>();

	const { copy, copied } = useClipboard({ copiedDuring: local.timeout });

	const disableAnimation = () =>
		originalProps?.disableAnimation ?? globalContext?.disableAnimation ?? false;

	const isMultiLine = () => children() && Array.isArray(children());

	const { isFocusVisible, isFocused, focusProps } = createFocusRing({
		autofocus: local.autofocus,
	});

	const slots = () =>
		snippet(
			mergeProps(variantProps, {
				get disableAnimation() {
					return disableAnimation();
				},
			}),
		);

	const symbolBefore = () => {
		if (!local.symbol || typeof local.symbol !== "string") return local.symbol;
		const str = local.symbol.trim();

		return str ? `${str} ` : "";
	};

	const getSnippetProps: PropGetter = () =>
		mergeProps(
			{
				ref: mergeRefs(local.ref, setDomRef),
				get class() {
					return slots().base({
						class: clsx(local.classes?.base, local.class),
					});
				},
			},
			filterDOMProps(rest, {
				enabled: shouldFilterDOMProps,
			}),
		);

	const onCopy = () => {
		if (local.disableCopy) {
			return;
		}

		let stringValue = "";

		if (typeof children() === "string") {
			stringValue = children() as string;
		} else if (Array.isArray(children())) {
			children.toArray().map((child) => {
				const childString =
					typeof child === "string" ? child : child?.toString();

				if (childString) {
					stringValue += `${childString}\n`;
				}
			});
		}

		const valueToCopy = () =>
			local.codeString || stringValue || preRef()?.textContent || "";

		copy(valueToCopy());
		local.onCopy?.(valueToCopy());
	};

	const getCopyButtonProps: PropGetter = () => {
		return mergeProps(
			{
				"aria-label": "Copy to clipboard",
				size: "sm",
				variant: "light",
				get isDisabled() {
					return local.disableCopy;
				},
				onPress: onCopy,
				isIconOnly: true,
			} as ButtonProps,
			local.copyButtonProps,
			{
				get "data-copied"() {
					return dataAttr(copied);
				},
				get class() {
					return slots().copyButton({
						class: local.classes?.copyButton,
					});
				},
			},
		);
	};

	return {
		children,
		Component,
		local,
		domRef,
		setPreRef,
		slots,
		isMultiLine,
		symbolBefore,
		getCopyButtonProps,
		getSnippetProps,
	};
}

export type UseSnippetReturn = ReturnType<typeof useSnippet>;
