import type { PropGetter } from "@saftox-ui/system";
import type { ContextType, UseButtonGroupProps } from "./button-types";

import {
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";

import { mapPropsVariants } from "@saftox-ui/system";
import { buttonGroup } from "@saftox-ui/theme";
import { combineProps } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";

export function useButtonGroup(originalProps: UseButtonGroupProps) {
	const [props, variantProps] = mapPropsVariants(
		originalProps,
		buttonGroup.variantKeys,
	);

	const defaultProps: UseButtonGroupProps = {
		size: "md",
		color: "default",
		variant: "solid",
		radius: "md",
		isDisabled: false,
		disableAnimation: false,
		isIconOnly: false,
	};

	const propsWithDefault = mergeProps(defaultProps, props);

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

	const [domRef, setDomRef] = createSignal<HTMLDivElement | undefined>();

	const classNames = createMemo(() =>
		buttonGroup(combineProps(variantProps, { class: contexts.class })),
	);

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
		classNames,
		getButtonGroupProps,
	};
}

export type UseButtonGroupReturn = ReturnType<typeof useButtonGroup>;
