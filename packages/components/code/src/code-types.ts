import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps } from "@saftox-ui/system";
import type { CodeVariantProps, SlotsToClasses } from "@saftox-ui/theme";

interface Props extends HTMLSaftoxUIProps<"code"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref;
}

export type UseCodeProps = Props & CodeVariantProps;
export interface CodeProps extends UseCodeProps {}
