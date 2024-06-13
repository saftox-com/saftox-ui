import type { VariantProps } from "@saftox-ui/variants";

import { colorVariants } from "../utils";
import { tv } from "../utils/tv";

/**
 * Code wrapper **Variants** component
 *
 * const classes = code({...})
 *
 * @example
 * <code className={classNames)}>
 *   npm install @saftox-ui/solid
 * </code>
 */
const code = tv({
	base: [
		"px-2",
		"py-1",
		"h-fit",
		"font-mono",
		"font-normal",
		"inline-block",
		"whitespace-nowrap",
	],
	variants: {
		color: {
			default: colorVariants.flat.default,
			primary: colorVariants.flat.primary,
			secondary: colorVariants.flat.secondary,
			success: colorVariants.flat.success,
			warning: colorVariants.flat.warning,
			danger: colorVariants.flat.danger,
		},
		size: {
			sm: "text-small",
			md: "text-medium",
			lg: "text-large",
		},
		radius: {
			none: "rounded-none",
			sm: "rounded-small",
			md: "rounded-medium",
			lg: "rounded-large",
			full: "rounded-full",
		},
	},
	defaultVariants: {
		color: "default",
		size: "sm",
		radius: "sm",
	},
});

export type CodeVariantProps = VariantProps<typeof code>;

export { code };
