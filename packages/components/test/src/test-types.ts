import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type {
	SlotsToClasses,
	TestSlots,
	TestVariantProps,
} from "@saftox-ui/theme";

interface Props extends HTMLSaftoxUIProps<"div"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * ```
	 */
	classes?: SlotsToClasses<TestSlots>;
}

export type UseTestProps = Props & TestVariantProps;
export interface TestProps extends UseTestProps {}
