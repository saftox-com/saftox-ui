import type { ContextType, UseButtonGroupProps } from "./button-types";

import { createEffect, createSignal, mergeProps, splitProps } from "solid-js";

import { mapPropsVariants } from "@saftox-ui/system";
import { buttonGroup } from "@saftox-ui/theme";

import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";

export function useButtonGroup(originalProps: UseButtonGroupProps) {
	const [_, variantProps] = mapPropsVariants(
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

	const propsWithDefault = mergeProps(defaultProps, originalProps);

	const [local, contexts, otherProps] = splitProps(
		propsWithDefault,
		["ref", "as", "fullWidth"],
		[
			"class",
			"size",
			"color",
			"variant",
			"radius",
			"isDisabled",
			"disableAnimation",
			"isIconOnly",
		],
	);

	const component = local.as || "div";

	const [domRef, setDomRef] = createSignal<HTMLElement | undefined>();

	const slots = () =>
		buttonGroup(combineProps(variantProps(), { class: contexts.class }));

	const context: ContextType = combineProps(contexts, {
		get fullWidth() {
			return !!local.fullWidth;
		},
	});

	const getButtonGroupProps = combineProps(
		{
			ref: mergeRefs(local.ref, setDomRef),
			role: "group",
		},
		otherProps,
	);

	return {
		component,
		domRef,
		context,
		slots,
		getButtonGroupProps,
	};
}

export type UseButtonGroupReturn = ReturnType<typeof useButtonGroup>;
