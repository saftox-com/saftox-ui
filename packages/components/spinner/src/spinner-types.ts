import type { HTMLSaftoxUIProps, PropGetter } from '@saftox-ui/system-ssc'
import type { SlotsToClasses, SpinnerSlots, SpinnerVariantProps } from '@saftox-ui/theme'
import type { Ref } from 'solid-js'

interface Props extends HTMLSaftoxUIProps<'div'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLDivElement> | undefined
  /**
   * Spinner label, in case you passed it will be used as `aria-label`.
   */
  label?: string
  /**
   * Classes or List of classes to change the classes of the element.
   * if `classes` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Spinner classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    circle1: "circle1-classes",
   *    circle2: "circle2-classes",
   *    label: "label-classes"
   * }} />
   * ```
   */
  classes?: SlotsToClasses<SpinnerSlots>
}

export type UseSpinnerProps = Props & SpinnerVariantProps
