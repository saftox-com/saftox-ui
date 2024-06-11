import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps, PropGetter } from "@saftox-ui/system-ssc";
import type { SpacerVariantProps } from "@saftox-ui/theme";

import { clsx, dataAttr } from "@saftox-ui/shared-utils";
import { mapPropsVariants } from "@saftox-ui/system-ssc";
import { spacer } from "@saftox-ui/theme";
import { mergeProps, splitProps } from "solid-js";

import { combineProps, combineStyle } from "@saftox-ui/solid-utils/reactivity";
import { type Space, spacing } from "./utils";

interface Props extends HTMLSaftoxUIProps<"span"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
	/**
	 * The x-axis margin.
	 * @default 1
	 *
	 * @see https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
	 */
	x?: Space;
	/**
	 * The y-axis margin.
	 * @default 1
	 *
	 * @see https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
	 */
	y?: Space;
}

export type UseSpacerProps = Props & SpacerVariantProps;

export const getMargin = (value: Space) => {
	return spacing[value] ?? value;
};

export function useSpacer(originalProps: UseSpacerProps) {
	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		spacer.variantKeys,
	);

	const defaultProps = {
		x: 1 as Space,
		y: 1 as Space,
	};

	const props = mergeProps(defaultProps, omitVariantProps);

	const [local, rest] = splitProps(props, ["ref", "as", "class", "x", "y"]);

	const Component = local.as || "span";

	const styles = () =>
		spacer(
			combineProps(variantProps, {
				get class() {
					return local.class;
				},
			}),
		);

	const getSpacerProps: PropGetter = (props = {}) =>
		mergeProps(rest, {
			ref: local.ref,
			"arria-hidden": true,
			get class() {
				return clsx(styles(), props.class);
			},
			get style() {
				return {
					...combineStyle(props.style, rest.style),
					"margin-left": getMargin(local.x),
					"margin-top": getMargin(local.y),
				};
			},
		});

	return { Component, getSpacerProps };
}

export type UseSpacerReturn = ReturnType<typeof useSpacer>;
