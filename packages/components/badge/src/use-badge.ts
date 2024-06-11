import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps, PropGetter } from "@saftox-ui/system";
import type {
	BadgeSlots,
	BadgeVariantProps,
	SlotsToClasses,
} from "@saftox-ui/theme";

import { clsx } from "@saftox-ui/shared-utils";
import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";
import { mapPropsVariants, useProviderContext } from "@saftox-ui/system";
import { badge } from "@saftox-ui/theme";
import { mergeProps, splitProps } from "solid-js";

interface Props extends HTMLSaftoxUIProps<"span", "content"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLSpanElement>;
	/**
	 * The content of the badge. The badge will be rendered relative to its children.
	 */
	content?: string | number | JSX.Element;
	/**
	 * Whether to disable the outline around the badge.
	 * @default false
	 */
	showOutline?: boolean;
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Badge classes={{
	 *    base:"base-classes", // wrapper
	 *    badge: "badge-classes",
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<BadgeSlots>;
}

export type UseBadgeProps = Props & BadgeVariantProps;

export function useBadge(originalProps: UseBadgeProps) {
	const globalContext = useProviderContext();

	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		badge.variantKeys,
	);

	const [local, rest] = splitProps(omitVariantProps(), [
		"ref",
		"as",
		"children",
		"class",
		"classes",
		"content",
	]);

	const Component = local.as || "span";

	const reactivityProps = {
		get disableAnimation() {
			return (
				originalProps?.disableAnimation ??
				globalContext?.disableAnimation ??
				false
			);
		},
		get isOneChar() {
			return String(local.content)?.length === 1 || originalProps?.isOneChar;
		},
		get isDot() {
			return String(local.content)?.length === 0;
		},
		get baseStyles() {
			return clsx(local.classes?.badge, local.class);
		},
		get isInvisible() {
			return originalProps?.isInvisible;
		},
	};

	const slots = () =>
		badge(
			mergeProps(variantProps, {
				get showOutline() {
					return originalProps?.showOutline || false;
				},
				get isOneChar() {
					return reactivityProps.isOneChar;
				},
				get isDot() {
					return reactivityProps.isDot;
				},
			}),
		);

	const getBadgeProps: PropGetter = () => {
		return combineProps(
			{
				ref: local.ref,
				get class() {
					return slots().badge({ class: reactivityProps.baseStyles });
				},
				get "data-invisible"() {
					return reactivityProps.isInvisible;
				},
			},
			rest,
		);
	};

	return {
		Component,
		reactivityProps,
		get content() {
			return local.content;
		},
		slots,
		getBadgeProps,
	};
}

export type UseBadgeReturn = ReturnType<typeof useBadge>;
