import type {
	AriaLabelingProps,
	AriaValidationProps,
	FocusableDOMProps,
	FocusableProps,
	InputBase,
	Validation,
} from "@saftox-ui/types";
import type { Accessor, JSX } from "solid-js";
import type { CreateToggleStateProps, ToggleState } from "./createToggleState";

import { createMemo, mergeProps } from "solid-js";

import { createFocusable } from "@saftox-ui/focus";
import { createPress } from "@saftox-ui/interactions";
import { filterDOMProps } from "@saftox-ui/utils";

import { createToggleState } from "./createToggleState";

export interface AriaToggleProps
	extends Omit<CreateToggleStateProps, "isReadOnly">,
		InputBase,
		Validation,
		FocusableProps,
		FocusableDOMProps,
		AriaLabelingProps,
		AriaValidationProps {
	/**
	 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
	 */
	"aria-controls"?: string;

	/**
	 * The label for the element.
	 */
	children?: JSX.Element;

	/**
	 * The value of the input element, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
	 */
	value?: string;

	/**
	 * The name of the input element, used when submitting an HTML form.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
	 */
	name?: string;
}

export interface ToggleAria {
	/**
	 * Props to be spread on the input element.
	 */
	inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
	/**
	 * Whether the target is currently pressed.
	 */
	isPressed: Accessor<boolean>;
	/**
	 * State for the toggle element, as returned by `createToggleState`.
	 */
	state: ToggleState;
}

/**
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 * @param props - Props for the toggle element.
 * @param inputRef - Ref to the HTML input element.
 */
export function createToggle(
	originalProps: AriaToggleProps,
	inputRef: Accessor<HTMLInputElement | undefined>,
): ToggleAria {
	const defaultProps: AriaToggleProps = {
		isDisabled: false,
		validationState: "valid",
	};

	const props = mergeProps(defaultProps, originalProps);

	const state = createToggleState(props);

	const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
		// since we spread props on label, onChange will end up there as well as in here.
		// so we have to stop propagation at the lowest level that we care about
		event.stopPropagation();

		const target = event.target as HTMLInputElement;

		state.setSelected(target.checked);

		// Unlike in React, inputs `checked` state can be out of sync with our toggle state.
		// for example a readonly `<input type="checkbox" />` is always "checkable".
		//
		// Also even if an input is controlled (ex: `<input type="checkbox" checked={isChecked} />`,
		// clicking on the input will change its internal `checked` state.
		//
		// To prevent this, we need to force the input `checked` state to be in sync with the toggle state.
		target.checked = state.isSelected();
	};

	// This handles focusing the input on pointer down, which Safari does not do by default.
	const { pressProps, isPressed } = createPress<HTMLInputElement>({
		isDisabled: () => props.isDisabled,
	});

	const { focusableProps } = createFocusable(props, inputRef);

	const domProps = mergeProps(
		createMemo(() => filterDOMProps(props, { labelable: true })),
	);

	const baseToggleProps: JSX.InputHTMLAttributes<any> = {
		type: "checkbox",
		get "aria-invalid"() {
			return props.validationState === "invalid" || undefined;
		},
		get "aria-errormessage"() {
			return props["aria-errormessage"];
		},
		get "aria-controls"() {
			return props["aria-controls"];
		},
		get "aria-readonly"() {
			return props.isReadOnly || undefined;
		},
		get "aria-required"() {
			return props.isRequired || undefined;
		},
		get disabled() {
			return props.isDisabled;
		},
		get value() {
			return props.value;
		},
		get name() {
			return props.name;
		},
		onChange,
	};

	const inputProps = mergeProps(
		domProps,
		baseToggleProps,
		pressProps,
		focusableProps,
	);

	return { inputProps, isPressed, state };
}
