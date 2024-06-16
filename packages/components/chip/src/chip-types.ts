import type { AvatarProps } from "@saftox-ui/avatar";
import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type {
	ChipSlots,
	ChipVariantProps,
	SlotsToClasses,
} from "@saftox-ui/theme";
import type { PressEvent } from "@saftox-ui/types";
import type { JSX, ValidComponent, VoidComponent } from "solid-js";

export type ContentProps = { class?: string };
export type ContentPropsFn = (props: ContentProps) => ContentProps;
export type ContentValidComponent =
	| JSX.Element
	| VoidComponent<ContentPropsFn | ContentProps>;

interface Props extends HTMLSaftoxUIProps<"div"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
	/**
	 * Avatar to be rendered in the left side of the chip.
	 */
	avatar?: (props: AvatarProps) => JSX.Element;
	/**
	 * Element to be rendered in the left side of the chip.
	 * this props overrides the `avatar` prop.
	 */
	startContent?: JSX.Element | VoidComponent<ContentPropsFn>;
	/**
	 * Element to be rendered in the right side of the chip.
	 * if you pass this prop and the `onClose` prop, the passed element
	 * will have the close button props and it will be rendered instead of the
	 * default close button.
	 */
	endContent?: JSX.Element | VoidComponent<ContentPropsFn>;
	/**
	 * class or List of classes to change the clsses of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Chip clsses={{
	 *    base:"base-classes",
	 *    dot: "dot-classes",
	 *    content: "content-classes",
	 *    avatar: "avatar-classes",
	 *    closeButton: "close-button-classes",
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<ChipSlots>;
	/**
	 * Callback fired when the chip is closed. if you pass this prop,
	 * the chip will display a close button (endContent).
	 * @param e PressEvent
	 */
	onClose?: (e: PressEvent) => void;
}

export type GetContentCloneProps = (
	content: ValidComponent | ContentValidComponent,
) => JSX.Element;

export type GetAvatarCloneProps = (
	avatar: JSX.Element | VoidComponent<AvatarProps>,
) => JSX.Element;

export type UseChipProps = Props & ChipVariantProps;
export interface ChipProps extends UseChipProps {}
