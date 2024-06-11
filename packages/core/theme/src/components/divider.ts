import type { VariantProps } from "@saftox-ui/variants";

import { tv } from "../utils/tv";

/**
 * Divider wrapper **Variants** component
 *
 * @example
 *
 * const styles = divider()
 *
 * <span classes={styles} />
 */
const divider = tv({
	base: "shrink-0 bg-divider border-none",
	variants: {
		orientation: {
			horizontal: "w-full h-divider",
			vertical: "h-full w-divider",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});

export type DividerVariantProps = VariantProps<typeof divider>;

export { divider };
