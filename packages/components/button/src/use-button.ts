import type { SpinnerProps } from "@saftox-ui/spinner";
import type { PropGetter } from "@saftox-ui/system";
import type { JSX } from "solid-js";
import type { AriaButtonProps, UseButtonProps } from "./button-types";

import { children, createSignal, mergeProps, splitProps } from "solid-js";

import { button } from "@saftox-ui/theme";

import { createFocusRing } from "@saftox-ui/focus";
import { createHover } from "@saftox-ui/interactions";
import { Spinner } from "@saftox-ui/spinner";
import { filterDOMProps } from "@saftox-ui/utils";

import { clsx, dataAttr } from "@saftox-ui/shared-utils";
import {
	chain,
	combineProps,
	mergeRefs,
} from "@saftox-ui/solid-utils/reactivity";

import { createButton } from "./create-button";

import { useButtonGroupContext } from "./button-group-context";

export function useButton<T extends HTMLButtonElement>(props: UseButtonProps) {
	const [domRef, setDomRef] = createSignal<HTMLElement | undefined>();

	const groupContext = useButtonGroupContext();
	const defaultProps: UseButtonProps = {
		variant: "glow",
		color: "default",
		size: "md",
		spinnerPlacement: "start",
		disableAnimation: false,
		fullWidth: false,
		isDisabled: false,
		isIconOnly: false,
		isLoading: false,
	};

	const spinner = () => Spinner({ color: "current", size: spinnerSize() });

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

	const component = local.as || "button";
	const shouldFilterDOMProps = typeof component === "string";

	const { isFocusVisible, isFocused, focusProps } = createFocusRing({
		autofocus: local.autofocus,
		isTextInput: false,
	});

	const isDisabled = () => local.isDisabled || local.isLoading;
	const isLoading = () => local.isLoading;

	const slots = () => {
		return button(
			combineProps(variantProps, {
				get isInGroup() {
					return !!groupContext;
				},
				isDisabled: isDisabled(),
			}),
		);
	};

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
			get class() {
				return slots().base({
					class: clsx(props.class, local.class),
				});
			},
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
				return dataAttr(isLoading);
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

	const spinnerSize = () => {
		const buttonSpinnerSizeMap: Record<string, SpinnerProps["size"]> = {
			sm: "sm",
			md: "sm",
			lg: "md",
		};

		return buttonSpinnerSizeMap[
			variantProps.size as keyof typeof buttonSpinnerSizeMap
		];
	};

	return {
		domRef,
		component,
		slots,
		startContent,
		endContent,
		isLoading,
		isDisabled,
		get isIconOnly() {
			return variantProps.isIconOnly;
		},
		get spinnerPlacement() {
			return () => local.spinnerPlacement;
		},
		getButtonProps,
		propsWithDefault,
		spinner,
	};
}

export type UseButtonReturn = ReturnType<typeof useButton>;
