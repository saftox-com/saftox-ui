import {
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";

import { mapPropsVariants, useProviderContext } from "@saftox-ui/system";
import type { PropGetter } from "@saftox-ui/system";

import {
	chain,
	clsx,
	dataAttr,
	isEmpty,
	safeAriaLabel,
} from "@saftox-ui/shared-utils";
import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";
import { textfield } from "@saftox-ui/theme";

import { createFocusRing } from "@saftox-ui/focus";
import {
	createFocusWithin,
	createHover,
	createPress,
} from "@saftox-ui/interactions";
import { createTextField } from "./create-textfield";

import { createControllableSignal, filterDOMProps } from "@saftox-ui/utils";

import type { UseTextfieldProps } from "./textfield-types";

export function useTextfield<
	T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(originalProps: UseTextfieldProps<T>) {
	const globalContext = useProviderContext();

	const [props, variantsProps] = mapPropsVariants(
		originalProps,
		textfield.variantKeys,
	);

	const defaultProps = {
		get validationBehavior() {
			return globalContext?.validationBehavior ?? "aria";
		},
		onValueChange: () => {},
		onValueInput: () => {},
	};

	const propsWithDefault = mergeProps(defaultProps, props);

	const [local, rest] = splitProps(propsWithDefault, [
		"ref",
		"as",
		"type",
		"label",
		"baseRef",
		"wrapperRef",
		"description",
		"class",
		"classes",
		"autofocus",
		"startContent",
		"endContent",
		"onClear",
		"onChange",
		"onInput",
		"validationState",
		"validationBehavior",
		"innerWrapperRef",
		"onValueChange",
		"onValueInput",
	]);

	const Component = local.as || "div";

	const [isFocusWithin, setFocusWithin] = createSignal(false);

	const [domRef, setDomRef] = createSignal<T>();
	const [baseDomRef, setBaseDomRef] = createSignal<HTMLDivElement>();
	const [inputWrapperRef, setInputWrapperRef] = createSignal<HTMLDivElement>();
	const [innerWrapperRef, setInnerWrapperRef] = createSignal<HTMLDivElement>();

	const handleValueChange = (value: string | undefined) => {
		local.onValueChange(value ?? "");
		local.onValueInput(value ?? "");
	};

	const [inputValue, setInputValue] = createControllableSignal({
		value: rest.value,
		defaultValue: rest.defaultValue ?? "",
		onChange: handleValueChange,
	});

	const handleClear = () => {
		setInputValue("");
		local.onClear?.();

		domRef()?.focus();
	};

	const disableAnimation = () =>
		originalProps.disableAnimation ?? globalContext.disableAnimation ?? false;

	const state = {
		get isFilledByDefault() {
			return ["date", "time", "month", "week", "range"].includes(local.type!);
		},
		get isFilled() {
			return !isEmpty(inputValue()) || this.isFilledByDefault;
		},
		get isFilledWithin() {
			return this.isFilled || isFocusWithin();
		},
		get isMultiline() {
			return originalProps.isMultiline;
		},
	};

	const baseStyles = () =>
		clsx(local.classes?.base, local.class, states.isFilled && "is-filled");

	// ARIA

	const mergeCreateTextFieldProps = mergeProps(originalProps as any, {
		autoCapitalize: originalProps.autoCapitalize,
		get value() {
			return inputValue();
		},
		get "aria-label"() {
			return safeAriaLabel(
				originalProps?.["aria-label"],
				originalProps?.label,
				originalProps?.placeholder,
			);
		},
		get inputElementType() {
			return states.isMultiline ? "textarea" : "input";
		},
		onChange: setInputValue,
		onInput: (e: InputEvent) => setInputValue((e.target as T).value),
	});

	const { labelProps, inputProps, descriptionProps, errorMessageProps } =
		createTextField(mergeCreateTextFieldProps, domRef);

	const { isHovered, hoverProps } = createHover({
		isDisabled: !!originalProps?.isDisabled,
	});

	const { isFocusVisible, isFocused, focusProps } = createFocusRing({
		autofocus: local.autofocus,
		isTextInput: true,
	});

	const {
		focusProps: clearFocusProps,
		isFocusVisible: isClearButtonFocusVisible,
	} = createFocusRing();

	const { focusWithinProps } = createFocusWithin({
		onFocusWithinChange: setFocusWithin,
	});

	const { pressProps: clearPressProps } = createPress({
		isDisabled: !!originalProps?.isDisabled,
		onPress: handleClear,
	});

	const states = combineProps(state, {
		get errorMessage() {
			return originalProps.errorMessage;
		},
		get isInvalid() {
			return local.validationState === "invalid" || originalProps.isInvalid;
		},
		get labelPlacement() {
			if (
				(!originalProps.labelPlacement ||
					originalProps.labelPlacement === "inside") &&
				!local.label
			) {
				return "outside";
			}
			return originalProps.labelPlacement ?? "inside";
		},
		get isClearable() {
			return !!local.onClear || originalProps.isClearable;
		},
		get hasElements() {
			return !!local.label || !!local.description || !!this.errorMessage;
		},
		get hasPlaceholder() {
			return !!originalProps.placeholder;
		},
		get hasLabel() {
			return !!local.label;
		},
		get hasHelper() {
			return !!local.description || !!this.errorMessage;
		},
		get shouldLabelBeOutside() {
			return (
				this.labelPlacement === "outside" ||
				this.labelPlacement === "outside-left"
			);
		},
		get shouldLabelBeInside() {
			return this.labelPlacement === "inside";
		},
		get isPlaceholderShown() {
			const domRefValue = domRef()?.value;
			const inputValueValue = inputValue();
			return (
				(!domRefValue ||
					domRefValue === "" ||
					!inputValueValue ||
					inputValueValue === "") &&
				this.hasPlaceholder
			);
		},
		get isOutsideLeft() {
			return this.labelPlacement === "outside-left";
		},
		get hasStartContent() {
			return "startContent" in originalProps;
		},
		get isLabelOutside() {
			return (
				this.shouldLabelBeOutside &&
				(this.labelPlacement === "outside-left" ||
					this.hasPlaceholder ||
					(this.labelPlacement === "outside" && this.hasStartContent))
			);
		},
		get isLabelOutsideAsPlaceholder() {
			return (
				this.labelPlacement === "outside" &&
				!this.hasPlaceholder &&
				!this.hasStartContent
			);
		},
		get hasEndContent() {
			return "endContent" in originalProps;
		},
	});

	const slots = createMemo(() => {
		return textfield(
			combineProps(variantsProps, {
				get isInvalid() {
					return states.isInvalid;
				},
				get isClearable() {
					return states.isClearable;
				},
				get disableAnimation() {
					return disableAnimation();
				},
			}),
		);
	});

	const getBaseProps: PropGetter = (props = {}, ref) => {
		return mergeProps(
			{
				get class() {
					return slots().base({ class: baseStyles() });
				},
				"data-slot": "base",
				get "data-filled"() {
					return dataAttr(
						states.isFilled ||
							states.hasPlaceholder ||
							states.hasStartContent ||
							states.isPlaceholderShown,
					);
				},
				get "data-filled-within"() {
					return dataAttr(
						states.isFilledWithin ||
							states.hasPlaceholder ||
							states.hasStartContent ||
							states.isPlaceholderShown,
					);
				},
				get "data-focus-within"() {
					return dataAttr(isFocusWithin);
				},
				get "data-focus-visible"() {
					return dataAttr(isFocusVisible);
				},
				get "data-readonly"() {
					return dataAttr(originalProps.isReadOnly);
				},
				get "data-focus"() {
					return dataAttr(isFocused);
				},
				get "data-hover"() {
					return dataAttr(isHovered);
				},
				get "data-invalid"() {
					return dataAttr(states.isInvalid);
				},
				get "data-disabled"() {
					return dataAttr(originalProps.isDisabled);
				},
				get "data-has-elements"() {
					return dataAttr(states.hasElements);
				},
				get "data-has-helper"() {
					return dataAttr(states.hasHelper);
				},
				get "data-has-label"() {
					return dataAttr(states.hasLabel);
				},
				get "data-has-value"() {
					return dataAttr(!states.isPlaceholderShown);
				},
			},
			focusWithinProps,
			props,
			{
				ref: mergeRefs(local.baseRef ?? ref, setBaseDomRef),
			},
		);
	};

	const getLabelProps: PropGetter<HTMLLabelElement> = (props = {}) => {
		return mergeProps(
			{
				"data-slot": "label",
				get class() {
					return slots().label({ class: local.classes?.label });
				},
			},
			labelProps,
			props,
		);
	};

	const getInputProps: PropGetter = (props = {}, ref) => {
		return mergeProps(
			{
				"data-slot": "input",
				get "data-filled"() {
					return dataAttr(states.isFilled);
				},
				get "data-filled-within"() {
					return dataAttr(states.isFilledWithin);
				},
				get "data-has-start-content"() {
					return dataAttr(states.hasStartContent);
				},
				get "data-has-end-content"() {
					return dataAttr(!!local.endContent);
				},
				get class() {
					return slots().input({
						class: clsx(local.classes?.input, states.isFilled && "is-filled"),
					});
				},
			},
			inputProps,
			focusProps,
			filterDOMProps(rest, {
				enabled: true,
				labelable: true,
				omitEventNames: new Set(Object.keys(inputProps)),
			}),
			props,
			{
				ref: mergeRefs(local.ref ?? ref, setDomRef),
				get "aria-readonly"() {
					return dataAttr(originalProps.isReadOnly);
				},
				onChange: chain(inputProps.onChange, local.onChange),
				onInput: chain(inputProps.onInput, local.onInput),
			},
		);
	};

	const getInputWrapperProps: PropGetter = (props = {}, ref) => {
		return mergeProps(
			{
				"data-slot": "input-wrapper",
				get "data-hover"() {
					return dataAttr(isHovered);
				},
				get "data-focus-visible"() {
					return dataAttr(isFocusVisible);
				},
				get "data-focus"() {
					return dataAttr(isFocused);
				},
				get class() {
					return slots().inputWrapper({
						class: clsx(
							local.classes?.inputWrapper,
							states.isFilled && "is-filled",
						),
					});
				},
				onClick: (e: MouseEvent) => {
					if (domRef() && e.currentTarget === e.target) {
						domRef()?.focus();
					}
				},
				style: {
					cursor: "text",
				},
			},
			hoverProps,
			props,
			{
				ref: mergeRefs(local.wrapperRef ?? ref, setInputWrapperRef),
			},
		);
	};

	const getInnerWrapperProps: PropGetter = (props = {}, ref) => {
		return mergeProps(props, {
			ref: mergeRefs(local.innerWrapperRef ?? ref, setInnerWrapperRef),
			"data-slot": "inner-wrapper",
			onClick: (e: MouseEvent) => {
				if (domRef() && e.currentTarget === e.target) {
					domRef()?.focus();
				}
			},
			get class() {
				return slots().innerWrapper({
					class: clsx(local.classes?.innerWrapper, props?.class),
				});
			},
		});
	};

	const getMainWrapperProps: PropGetter = (props = {}) => {
		return mergeProps(props, {
			"data-slot": "main-wrapper",
			get class() {
				return slots().mainWrapper({
					class: clsx(local.classes?.mainWrapper, props?.class),
				});
			},
		});
	};

	const getHelperWrapperProps: PropGetter = (props = {}) => {
		return mergeProps(props, {
			"data-slot": "helper-wrapper",
			get class() {
				return slots().helperWrapper({
					class: clsx(local.classes?.helperWrapper, props?.class),
				});
			},
		});
	};

	const getDescriptionProps: PropGetter = (props = {}) => {
		return mergeProps(props, descriptionProps, {
			"data-slot": "description",
			get class() {
				return slots().description({
					class: clsx(local.classes?.description, props?.class),
				});
			},
		});
	};

	const getErrorMessageProps: PropGetter = (props = {}) => {
		return mergeProps(props, errorMessageProps, {
			"data-slot": "error-message",
			get class() {
				return slots().errorMessage({
					class: clsx(local.classes?.errorMessage, props?.class),
				});
			},
		});
	};

	const getClearButtonProps: PropGetter = (props = {}) => {
		return mergeProps(
			props,
			{
				role: "button",
				tabIndex: 0,
				"data-slot": "clear-button",
				get "data-focus-visible"() {
					return dataAttr(isClearButtonFocusVisible);
				},
				get class() {
					return slots().clearButton({
						class: clsx(local.classes?.clearButton, props?.class),
					});
				},
			},
			clearPressProps,
			clearFocusProps,
		);
	};

	return combineProps(
		{ states: states },
		{
			Component,
			domRef,
			getBaseProps,
			getLabelProps,
			getInputProps,
			getInputWrapperProps,
			getInnerWrapperProps,
			getMainWrapperProps,
			getHelperWrapperProps,
			getDescriptionProps,
			getErrorMessageProps,
			getClearButtonProps,
		},
		local,
	);
}

export type UseTextfieldReturn = ReturnType<typeof useTextfield>;