import type { VariantProps } from '@saftox-ui/variants'

import { collapseAdjacentVariantBorders, colorVariants, dataFocusVisibleClasses } from '../utils'
import { tv } from '../utils/tv'

import { radiusClasses } from '../utils/classes'

/**
 * Button wrapper **Variants** component
 *
 * const slots = () => button({...})
 *
 * @example
 * <button
 *  class={slots())}
 *  data-pressed={true/false}
 *  data-hover={true/false}
 *  data-focus={true/false}
 *  data-focus-visible={true/false}
 * >
 * // glow effect component
 * <div class={slots().innerWrapper())}>
 *   Button
 * </div>
 * </button>
 */

const button = tv({
  slots: {
    base: [
      'z-0',
      'group',
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'box-border',
      'appearance-none',
      'outline-none',
      'select-none',
      'whitespace-nowrap',
      'min-w-max',
      'font-normal',
      'subpixel-antialiased',
      'overflow-hidden',
      'tap-highlight-transparent',
      // focus ring
      ...dataFocusVisibleClasses,
    ],
    innerWrapper: 'relative overflow-hidden flex items-center justify-center w-full h-full',
    glowEffect: 'absolute z-5 h-28 w-28 -translate-x-1/2 -translate-y-1/2',
  },
  variants: {
    variant: {
      solid: '',
      bordered: 'border-medium bg-transparent',
      glow: '',
      light: 'bg-transparent',
      flat: '',
      faded: 'border-medium',
      shadow: '',
      ghost: 'border-medium bg-transparent',
    },
    size: {
      sm: {
        base: 'min-w-16 h-8 text-tiny rounded-small',
        innerWrapper: 'px-3 gap-2 rounded-[calc(theme(borderRadius.small)-2px)]',
      },
      md: {
        base: 'min-w-20 h-10 text-small rounded-medium',
        innerWrapper: 'px-4 gap-2 rounded-[calc(theme(borderRadius.medium)-2px)]',
      },
      lg: {
        base: ' min-w-24 h-12 text-medium rounded-large',
        innerWrapper: 'px-6 gap-3 rounded-[calc(theme(borderRadius.large)-2px)]',
      },
    },
    color: {
      default: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
    },
    radius: {
      none: {
        base: 'rounded-none',
        innerWrapper: 'rounded-[calc(theme(borderRadius.none)-2px)]',
      },
      sm: {
        base: 'rounded-small',
        innerWrapper: 'rounded-[calc(theme(borderRadius.small)-2px)]',
      },
      md: {
        base: 'rounded-medium',
        innerWrapper: 'rounded-[calc(theme(borderRadius.medium)-2px)]',
      },
      lg: {
        base: 'rounded-large',
        innerWrapper: 'rounded-[calc(theme(borderRadius.large)-2px)]',
      },
      full: {
        base: 'rounded-full',
        innerWrapper: 'rounded-[calc(theme(borderRadius.full)-2px)]',
      },
    },
    fullWidth: {
      true: 'w-full',
    },
    isDisabled: {
      true: 'opacity-50 pointer-events-none',
    },
    isInGroup: {
      true: '![&:not(:first-child):not(:last-child)]:rounded-none',
    },
    isIconOnly: {
      true: {
        innerWrapper: 'px-0 gap-0',
      },
      // false: "[&>svg]:max-w-[theme(spacing.8)]",
    },
    disableAnimation: {
      true: '!transition-none',
      false:
        'data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'glow',
    color: 'default',
    fullWidth: false,
    isDisabled: false,
    isInGroup: false,
    disableAnimation: false,
  },
  compoundVariants: [
    // glow
    {
      variant: 'glow',
      class: {
        innerWrapper: ['z-10 backdrop-blur-sm bg-background/90'],
      },
    },
    {
      variant: 'glow',
      isInGroup: false,
      class: {
        base: [colorVariants.glow.default, 'p-0.5'],
      },
    },
    // solid / color
    {
      variant: 'solid',
      color: 'default',
      class: colorVariants.solid.default,
    },
    {
      variant: 'solid',
      color: 'primary',
      class: colorVariants.solid.primary,
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: colorVariants.solid.secondary,
    },
    {
      variant: 'solid',
      color: 'success',
      class: colorVariants.solid.success,
    },
    {
      variant: 'solid',
      color: 'warning',
      class: colorVariants.solid.warning,
    },
    {
      variant: 'solid',
      color: 'danger',
      class: colorVariants.solid.danger,
    },
    // shadow / color
    {
      variant: 'shadow',
      color: 'default',
      class: colorVariants.shadow.default,
    },
    {
      variant: 'shadow',
      color: 'primary',
      class: colorVariants.shadow.primary,
    },
    {
      variant: 'shadow',
      color: 'secondary',
      class: colorVariants.shadow.secondary,
    },
    {
      variant: 'shadow',
      color: 'success',
      class: colorVariants.shadow.success,
    },
    {
      variant: 'shadow',
      color: 'warning',
      class: colorVariants.shadow.warning,
    },
    {
      variant: 'shadow',
      color: 'danger',
      class: colorVariants.shadow.danger,
    },
    // bordered / color
    {
      variant: 'bordered',
      color: 'default',
      class: colorVariants.bordered.default,
    },
    {
      variant: 'bordered',
      color: 'primary',
      class: colorVariants.bordered.primary,
    },
    {
      variant: 'bordered',
      color: 'secondary',
      class: colorVariants.bordered.secondary,
    },
    {
      variant: 'bordered',
      color: 'success',
      class: colorVariants.bordered.success,
    },
    {
      variant: 'bordered',
      color: 'warning',
      class: colorVariants.bordered.warning,
    },
    {
      variant: 'bordered',
      color: 'danger',
      class: colorVariants.bordered.danger,
    },
    // flat / color
    {
      variant: 'flat',
      color: 'default',
      class: colorVariants.flat.default,
    },
    {
      variant: 'flat',
      color: 'primary',
      class: colorVariants.flat.primary,
    },
    {
      variant: 'flat',
      color: 'secondary',
      class: colorVariants.flat.secondary,
    },
    {
      variant: 'flat',
      color: 'success',
      class: colorVariants.flat.success,
    },
    {
      variant: 'flat',
      color: 'warning',
      class: colorVariants.flat.warning,
    },
    {
      variant: 'flat',
      color: 'danger',
      class: colorVariants.flat.danger,
    },
    // faded / color
    {
      variant: 'faded',
      color: 'default',
      class: colorVariants.faded.default,
    },
    {
      variant: 'faded',
      color: 'primary',
      class: colorVariants.faded.primary,
    },
    {
      variant: 'faded',
      color: 'secondary',
      class: colorVariants.faded.secondary,
    },
    {
      variant: 'faded',
      color: 'success',
      class: colorVariants.faded.success,
    },
    {
      variant: 'faded',
      color: 'warning',
      class: colorVariants.faded.warning,
    },
    {
      variant: 'faded',
      color: 'danger',
      class: colorVariants.faded.danger,
    },
    // light / color
    {
      variant: 'light',
      color: 'default',
      class: {
        base: [colorVariants.light.default, 'data-[hover=true]:bg-default/40'],
      },
    },
    {
      variant: 'light',
      color: 'primary',
      class: {
        base: [colorVariants.light.primary, 'data-[hover=true]:bg-primary/20'],
      },
    },
    {
      variant: 'light',
      color: 'secondary',
      class: [colorVariants.light.secondary, 'data-[hover=true]:bg-secondary/20'],
    },
    {
      variant: 'light',
      color: 'success',
      class: {
        base: [colorVariants.light.success, 'data-[hover=true]:bg-success/20'],
      },
    },
    {
      variant: 'light',
      color: 'warning',
      class: {
        base: [colorVariants.light.warning, 'data-[hover=true]:bg-warning/20'],
      },
    },
    {
      variant: 'light',
      color: 'danger',
      class: {
        base: [colorVariants.light.danger, 'data-[hover=true]:bg-danger/20'],
      },
    },
    // ghost / color
    {
      variant: 'ghost',
      color: 'default',
      class: colorVariants.ghost.default,
    },
    {
      variant: 'ghost',
      color: 'primary',
      class: colorVariants.ghost.primary,
    },
    {
      variant: 'ghost',
      color: 'secondary',
      class: colorVariants.ghost.secondary,
    },
    {
      variant: 'ghost',
      color: 'success',
      class: colorVariants.ghost.success,
    },
    {
      variant: 'ghost',
      color: 'warning',
      class: colorVariants.ghost.warning,
    },
    {
      variant: 'ghost',
      color: 'danger',
      class: colorVariants.ghost.danger,
    },
    // isInGroup / radius / size <-- radius not provided
    {
      isInGroup: true,
      class: {
        base: 'rounded-none first:rounded-l-medium last:rounded-r-medium',
        innerWrapper: 'rounded-none',
      },
    },
    {
      isInGroup: true,
      size: 'sm',
      class: 'rounded-none first:rounded-l-small last:rounded-r-small',
    },
    {
      isInGroup: true,
      size: 'md',
      class: 'rounded-none first:rounded-l-medium last:rounded-r-medium',
    },
    {
      isInGroup: true,
      size: 'lg',
      class: {
        base: 'rounded-none first:rounded-l-large last:rounded-r-large',
      },
    },
    {
      isInGroup: true,
      isRounded: true,
      class: 'rounded-none first:rounded-l-full last:rounded-r-full',
    },
    // isInGroup / radius <-- radius provided
    {
      isInGroup: true,
      radius: 'none',
      class: 'rounded-none first:rounded-l-none last:rounded-r-none',
    },
    {
      isInGroup: true,
      radius: 'sm',
      class: 'rounded-none first:rounded-l-small last:rounded-r-small',
    },
    {
      isInGroup: true,
      radius: 'md',
      class: 'rounded-none first:rounded-l-medium last:rounded-r-medium',
    },
    {
      isInGroup: true,
      radius: 'lg',
      class: {
        base: 'rounded-none first:rounded-l-large last:rounded-r-large',
      },
    },
    {
      isInGroup: true,
      radius: 'full',
      class: { base: 'rounded-none first:rounded-l-full last:rounded-r-full' },
    },
    // isInGroup / bordered / ghost
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'default',
      class: collapseAdjacentVariantBorders.default,
    },
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'primary',
      class: collapseAdjacentVariantBorders.primary,
    },
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'secondary',
      class: collapseAdjacentVariantBorders.secondary,
    },
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'success',
      class: collapseAdjacentVariantBorders.success,
    },
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'warning',
      class: collapseAdjacentVariantBorders.warning,
    },
    {
      isInGroup: true,
      variant: ['ghost', 'bordered'],
      color: 'danger',
      class: collapseAdjacentVariantBorders.danger,
    },
    {
      isIconOnly: true,
      size: 'sm',
      class: 'min-w-8 w-8 h-8',
    },
    {
      isIconOnly: true,
      size: 'md',
      class: 'min-w-10 w-10 h-10',
    },
    {
      isIconOnly: true,
      size: 'lg',
      class: 'min-w-12 w-12 h-12',
    },
    // variant / hover
    {
      variant: ['solid', 'faded', 'flat', 'bordered', 'shadow'],
      class: 'data-[hover=true]:opacity-90',
    },
  ],
})

/**
 * ButtonGroup wrapper **Variants** component
 *
 * const slots = () => buttonGroup({...})
 *
 * @example
 * <div role="group" class={slots().base())}>
 * 	// glow effect component
 *	<div class={slots().innerWrapper())}>
 *    // button elements
 *  </div>
 * </div>
 */
const buttonGroup = tv({
  slots: {
    base: 'relative inline-block',
    innerWrapper: 'inline-flex items-center justify-center h-auto',
  },
  variants: {
    fullWidth: {
      true: {
        base: 'w-full',
        innerWrapper: 'w-full',
      },
    },
    variant: {
      glow: '',
    },
    radius: radiusClasses,
  },
  defaultVariants: {
    variant: 'glow',
    radius: 'md',
  },
  compoundVariants: [
    {
      variant: 'glow',
      class: {
        base: [colorVariants.glow.default, 'p-0.5'],
        innerWrapper: ['gap-0.5'],
      },
    },
  ],
})

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroup>
export type ButtonVariantProps = VariantProps<typeof button>

export { button, buttonGroup }
