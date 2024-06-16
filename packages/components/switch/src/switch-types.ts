import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type {
	SlotsToClasses,
	ToggleSlots,
	ToggleVariantProps,
} from "@saftox-ui/theme";
import type { AriaToggleProps, ToggleState } from "@saftox-ui/toggle";
import type { AriaValidationProps, Validation } from "@saftox-ui/types";
import type { Accessor, JSX, VoidComponent } from "solid-js";

export type AriaSwitchProps = Omit<
	AriaToggleProps,
	keyof (Validation & AriaValidationProps)
>;

export interface SwitchAria {
	/**
	 * Props for the input element.
	 */
	inputProps: JSX.InputHTMLAttributes<HTMLInputElement>;
	/**
	 * Whether the target is currently pressed.
	 */
	isPressed: Accessor<boolean>;
	/**
	 * State for the switch, as returned by `createToggleState`.
	 */
	state: ToggleState;
}

export type SwitchThumbIconProps = {
	width: string;
	height: string;
	"data-checked": string;
	isSelected: boolean;
	class: string;
};

interface Props extends HTMLSaftoxUIProps<"input"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLInputElement>;
	/**
	 * Whether the switch is disabled.
	 * @default false
	 */
	isDisabled?: boolean;
	/**
	 * The icon to be displayed inside the thumb.
	 */
	thumbIcon?: VoidComponent<SwitchThumbIconProps>;
	/**
	 * Start icon to be displayed inside the switch.
	 */
	startContent?: VoidComponent<JSX.SvgSVGAttributes<SVGSVGElement>>;
	/**
	 * End icon to be displayed inside the switch.
	 */
	endContent?: VoidComponent<JSX.SvgSVGAttributes<SVGSVGElement>>;
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Switch classes={{
	 *    base:"base-classes",
	 *    wrapper: "wrapper-classes",
	 *    thumb: "thumb-classes",
	 *    thumbIcon: "thumbIcon-classes",
	 *    label: "label-classes",
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<ToggleSlots>;
	/**
	 * Aria onChange event.
	 */
	onValueChange?: AriaSwitchProps["onChange"];
}

export type UseSwitchProps = Omit<Props, "defaultChecked"> &
	Omit<AriaSwitchProps, keyof ToggleVariantProps | "onChange" | "onBlur"> &
	ToggleVariantProps;
export interface SwitchProps extends UseSwitchProps {}
