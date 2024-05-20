import type { PropGetter } from "@saftox-ui/system";
import type { JSX } from "solid-js";
import type { AriaButtonProps, UseButtonProps } from "./button-types";

import {
	children,
	createMemo,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";

import { button } from "@saftox-ui/theme";

import { createFocusRing } from "@saftox-ui/focus";
import { createHover } from "@saftox-ui/interactions";
import { filterDOMProps } from "@saftox-ui/utils";

import { dataAttr } from "@saftox-ui/shared-utils";
import { chain, mergeRefs } from "@saftox-ui/solid-utils/reactivity";

import { createButton } from "./createButton";

import { useButtonGroupContext } from "./button-group-context";

import { combineProps } from "@solid-primitives/props";

export function useButton<T extends HTMLButtonElement>(props: UseButtonProps) {
	const groupContext = useButtonGroupContext();

	const defaultProps: UseButtonProps = {
		color: "default",
		disableAnimation: false,
		fullWidth: false,
		isDisabled: false,
		isIconOnly: false,
		isLoading: false,
		size: "md",
		spinnerPlacement: "start",
		variant: "solid",
	};

	const propsWithDefault = mergeProps(defaultProps, groupContext, props);

	const [local, variantProps, rest] = splitProps(
		propsWithDefault,
		[
			"ref",
			"as",
			"children",
			"startContent",
			"endContent",
			"autofocus",
			"class",
			"spinner",
			"isDisabled",
			"isLoading",
			"spinnerPlacement",
			"onClick",
		],
		[
			"size",
			"color",
			"variant",
			"radius",
			"fullWidth",
			"disableAnimation",
			"isIconOnly",
		],
	);

	const [domRef, setDomRef] = createSignal<HTMLButtonElement | undefined>();

	const component = local.as || "button";
	const shouldFilterDOMProps = typeof component === "string";

	const { isFocusVisible, isFocused, focusProps } = createFocusRing({
		autofocus: local.autofocus,
		isTextInput: false,
	});

	const isDisabled = () => local.isDisabled || local.isLoading;
	const isLoading = () => local.isLoading;

	const styles = createMemo(() => {
		return button(
			combineProps(variantProps, {
				get isInGroup() {
					return !!groupContext;
				},
				isDisabled: isDisabled(),
				class: local.class,
			}),
		);
	});

	const handleClick: JSX.EventHandlerUnion<T, MouseEvent> = () => {
		if (isDisabled() || variantProps.disableAnimation) return;
	};

	const { buttonProps, isPressed } = createButton(
		combineProps(
			{
				elementType: component,
				isDisabled: isDisabled(),
				onClick: chain([handleClick, local.onClick]),
			},
			rest,
		) as AriaButtonProps,
		domRef,
	);

	const { isHovered, hoverProps } = createHover({
		isDisabled,
	});

	const getButtonProps: PropGetter<HTMLButtonElement> = (props = {}) => {
		const buttonLolcaProps = {
			ref: mergeRefs(local.ref, setDomRef),
			get "data-disabled"() {
				return dataAttr(isDisabled);
			},
			get "data-focus"() {
				return dataAttr(isFocused);
			},
			get "data-pressed"() {
				return dataAttr(isPressed);
			},
			get "data-focus-visible"() {
				return dataAttr(isFocusVisible);
			},
			get "data-hover"() {
				return dataAttr(isHovered);
			},
			get "data-loading"() {
				return dataAttr(local.isLoading);
			},
		};

		const mergeButtonProps = mergeProps(
			buttonProps,
			focusProps,
			hoverProps,
			shouldFilterDOMProps && filterDOMProps(rest),
			filterDOMProps(props),
		);

		return combineProps(mergeButtonProps, buttonLolcaProps);
	};

	const getIconClone = (icon: JSX.Element) => {
		const i = children(() => icon);

		return i();
	};

	const startContent = getIconClone(local.startContent);
	const endContent = getIconClone(local.endContent);

	return {
		component,
		styles,
		startContent,
		endContent,
		isLoading,
		isIconOnly: variantProps.isIconOnly,
		spinnerPlacement: local.spinnerPlacement,
		getButtonProps,
	};
}

export type UseButtonReturn = ReturnType<typeof useButton>;
