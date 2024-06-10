import type { VariantProps } from "@saftox-ui/variants";

import {
	colorVariants,
	dataFocusVisibleClasses,
	translateCenterClasses,
} from "../utils";
import { tv } from "../utils/tv";

/**
 * Avatar wrapper ** Variants** component
 *
 * const {base, img, icon, name } = avatar({...})
 *
 * @example
 * <div classes={base())} data-hover={true/false} data-focus={true/false} data-focus-visible={true/false}>
 *    <img classes={img()} src="https://picsum.photos/200/300" alt="your avatar" />
 *    <div role="img" aria-label="your name" classes={name()}>your name</div>
 *    <span role="img" aria-label="your icon" classes={icon()}>your icon</span>
 * </div>
 */
const avatar = tv({
	slots: {
		base: [
			"flex",
			"relative",
			"justify-center",
			"items-center",
			"box-border",
			"overflow-hidden",
			"align-middle",
			"text-white",
			"z-0",
			// focus ring
			...dataFocusVisibleClasses,
		],
		img: [
			"flex",
			"object-cover",
			"w-full",
			"h-full",
			"transition-opacity",
			"!duration-500",
			"opacity-0",
			"data-[loaded=true]:opacity-100",
		],
		fallback: [
			...translateCenterClasses,
			"flex",
			"items-center",
			"justify-center",
		],
		name: [
			...translateCenterClasses,
			"font-normal",
			"text-center",
			"text-inherit",
		],
		icon: [
			...translateCenterClasses,
			"flex",
			"items-center",
			"justify-center",
			"text-inherit",
			"w-full",
			"h-full",
		],
	},
	variants: {
		size: {
			sm: {
				base: "w-8 h-8 text-tiny",
			},
			md: {
				base: "w-10 h-10 text-tiny",
			},
			lg: {
				base: "w-14 h-14 text-small",
			},
		},
		color: {
			default: {
				base: colorVariants.solid.default,
			},
			primary: {
				base: colorVariants.solid.primary,
			},
			secondary: {
				base: colorVariants.solid.secondary,
			},
			success: {
				base: colorVariants.solid.success,
			},
			warning: {
				base: colorVariants.solid.warning,
			},
			danger: {
				base: colorVariants.solid.danger,
			},
		},
		radius: {
			none: {
				base: "rounded-none",
			},
			sm: {
				base: "rounded-small",
			},
			md: {
				base: "rounded-medium",
			},
			lg: {
				base: "rounded-large",
			},
			full: {
				base: "rounded-full",
			},
		},
		isBordered: {
			true: {
				base: "ring-2 ring-offset-2 ring-offset-background dark:ring-offset-background-dark",
			},
		},
		isDisabled: {
			true: {
				base: "opacity-disabled",
			},
		},
		isInGroup: {
			true: {
				base: [
					"-ms-2 data-[hover=true]:-translate-x-3 rtl:data-[hover=true]:translate-x-3 transition-transform",
					"data-[focus-visible=true]:-translate-x-3 rtl:data-[focus-visible=true]:translate-x-3",
				],
			},
		},
		isInGridGroup: {
			true: {
				base: "m-0 data-[hover=true]:translate-x-0",
			},
		},
		disableAnimation: {
			true: {
				base: "transition-none",
				img: "transition-none",
			},
			false: {},
		},
	},
	defaultVariants: {
		size: "md",
		color: "default",
		radius: "full",
	},
	compoundVariants: [
		{
			color: "default",
			isBordered: true,
			class: {
				base: "ring-default",
			},
		},
		{
			color: "primary",
			isBordered: true,
			class: {
				base: "ring-primary",
			},
		},
		{
			color: "secondary",
			isBordered: true,
			class: {
				base: "ring-secondary",
			},
		},
		{
			color: "success",
			isBordered: true,
			class: {
				base: "ring-success",
			},
		},
		{
			color: "warning",
			isBordered: true,
			class: {
				base: "ring-warning",
			},
		},
		{
			color: "danger",
			isBordered: true,
			class: {
				base: "ring-danger",
			},
		},
	],
});

/**
 * AvatarGroup wrapper **Variants** component
 *
 * const classes = avatarGroup({...})
 *
 * @example
 * <div role="group" className={classes())}>
 *   // avatar elements
 * </div>
 */
const avatarGroup = tv({
	slots: {
		base: "flex items-center justify-center h-auto w-max",
		count: "hover:-translate-x-0",
	},
	variants: {
		isGrid: {
			true: "inline-grid grid-cols-4 gap-3",
		},
	},
});

// calculated classes
// src/components/avatar/src/use-avatar-group.ts
// -ms-2 hover:-translate-x-0 ms-0

export type AvatarGroupVariantProps = VariantProps<typeof avatarGroup>;
export type AvatarGroupSlots = keyof ReturnType<typeof avatarGroup>;
export type AvatarVariantProps = VariantProps<typeof avatar>;
export type AvatarSlots = keyof ReturnType<typeof avatar>;

export { avatar, avatarGroup };
