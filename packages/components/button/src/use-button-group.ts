import type { PropGetter } from "@saftox-ui/system";
import type { ContextType, UseButtonGroupProps } from "./button-types";
import type { GlowEffectProps } from "./glow-effect";

import {
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";

import { mapPropsVariants } from "@saftox-ui/system";
import { buttonGroup } from "@saftox-ui/theme";

import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";

export function useButtonGroup(originalProps: UseButtonGroupProps) {
	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		buttonGroup.variantKeys,
	);

	const defaultProps: UseButtonGroupProps = {
		size: "md",
		color: "default",
		variant: "glow",
		radius: "md",
		isDisabled: false,
		disableAnimation: false,
		isIconOnly: false,
	};

	const props = mergeProps(defaultProps, omitVariantProps);

	const [local, contextProps, rest] = splitProps(
		props,
		["ref", "as"],
		[
			"class",
			"size",
			"color",
			"fullWidth",
			"isDisabled",
			"disableAnimation",
			"isIconOnly",
		],
	);

	const Component = local.as || "div";

	const [domRef, setDomRef] = createSignal<HTMLElement>();

	const slots = createMemo(() =>
		buttonGroup(
			combineProps(variantProps, {
				class: contextProps.class,
				get fillWidth() {
					return contextProps.fullWidth;
				},
			}),
		),
	);

	const context: ContextType = combineProps(contextProps, variantProps);

	const getButtonGroupProps: PropGetter = () => {
		return combineProps(
			{
				ref: mergeRefs(local.ref, setDomRef),
				role: "group",
			},
			rest,
		);
	};

	const getGlowEffectProps: GlowEffectProps = {
		ref: domRef,
		get radius() {
			return variantProps.radius;
		},
		get color() {
			return contextProps.color;
		},
	};

	return {
		Component,
		domRef,
		slots,
		context,
		getButtonGroupProps,
		getGlowEffectProps,
	};
}

export type UseButtonGroupReturn = ReturnType<typeof useButtonGroup>;
