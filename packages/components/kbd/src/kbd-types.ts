import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type {
	KbdSlots,
	KbdVariantProps,
	SlotsToClasses,
} from "@saftox-ui/theme";

import type { KbdKey } from "./utils";

interface Props extends HTMLSaftoxUIProps<"kbd"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
	/**
	 * The key or keys to be displayed.
	 */
	keys?: KbdKey | KbdKey[];
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Kbd classes={{
	 *    base:"base-classes",
	 *    abbr: "abbr-classes", // the key wrapper
	 *    content: "content-classes", // the children wrapper
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<KbdSlots>;
}

export type UseKbdProps = Props & KbdVariantProps;
export interface KbdProps extends UseKbdProps {}
