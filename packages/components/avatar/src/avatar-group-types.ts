import type { JSX } from "solid-js";

import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";

import type {
	AvatarGroupSlots,
	AvatarGroupVariantProps,
	SlotsToClasses,
} from "@saftox-ui/theme";

import type { AvatarProps } from "./avatar-types";

interface Props extends HTMLSaftoxUIProps<"div"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLDivElement | null>;
	/**
	 * Whether the avatars should be displayed in a grid
	 */
	isGrid?: boolean;
	/**
	 * The maximum number of visible avatars
	 * @default 5
	 */
	max?: number;
	/**
	 * Control the number of avatar not visible
	 */
	total?: number;
	/**
	 * This allows you to render a custom count component.
	 */
	renderCount?: (count: number) => JSX.Element;
	/**
	 * Classname or List of classes to change the classes of the avatar group.
	 * if `className` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <AvatarGroup classes={{
	 *    base: "base-classes",
	 *    count: "count-classes"
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<AvatarGroupSlots>;
}

export type UseAvatarGroupProps = Props &
	Omit<AvatarGroupVariantProps, "children" | "isGrid"> &
	Partial<
		Pick<AvatarProps, "size" | "color" | "radius" | "isDisabled" | "isBordered">
	>;

export interface AvatarGroupProps extends UseAvatarGroupProps {}

export type ContextType = {
	size?: AvatarProps["size"];
	color?: AvatarProps["color"];
	radius?: AvatarProps["radius"];
	isBordered?: AvatarProps["isBordered"];
	isDisabled?: AvatarProps["isDisabled"];
	isGrid?: boolean;
};
