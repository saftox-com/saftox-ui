import type { AriaSwitchProps } from './aria'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { SlotsToClasses, ToggleSlots, ToggleVariantProps } from '@saftox-ui/theme'
import type { JSX, VoidComponent } from 'solid-js'

export type SwitchThumbIconProps = {
  width: string
  height: string
  'data-checked': string
  isSelected: boolean
  class: string
}

interface Props extends HTMLSaftoxUIProps<'input'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLInputElement>
  /**
   * Whether the switch is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The icon to be displayed inside the thumb.
   */
  thumbIcon?: VoidComponent<SwitchThumbIconProps>
  /**
   * Start icon to be displayed inside the switch.
   */
  startContent?: VoidComponent<JSX.SvgSVGAttributes<SVGSVGElement>>
  /**
   * End icon to be displayed inside the switch.
   */
  endContent?: VoidComponent<JSX.SvgSVGAttributes<SVGSVGElement>>
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Switch classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    thumb: "thumb-classes",
   *    thumbIcon: "thumbIcon-classes",
   *    label: "label-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<ToggleSlots>
  /**
   * Aria onChange event.
   */
  onValueChange?: AriaSwitchProps['onChange']
}

export type UseSwitchProps = Omit<Props, 'defaultChecked'> &
  Omit<AriaSwitchProps, keyof ToggleVariantProps | 'onChange' | 'onBlur'> &
  ToggleVariantProps
export interface SwitchProps extends UseSwitchProps {}
