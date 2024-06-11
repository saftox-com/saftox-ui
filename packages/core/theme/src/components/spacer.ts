import type { VariantProps } from "@saftox-ui/variants";

import { tv } from "../utils/tv";

/**
 * Spacer wrapper **Variants** component
 *
 * @example
 *
 * const styles = spacer()
 *
 * <span classes={styles} />
 */
const spacer = tv({
	base: "w-px h-px inline-block",
	variants: {
		isInline: {
			true: "inline-block",
			false: "block",
		},
	},
	defaultVariants: {
		isInline: false,
	},
});

export type SpacerVariantProps = VariantProps<typeof spacer>;

export { spacer };
