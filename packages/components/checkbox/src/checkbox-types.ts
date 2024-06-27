import type { AriaCheckboxProps } from './aria/create-checkbox'
import type { AriaCheckboxGroupProps } from './aria/create-checkbox-group'
import type { CheckboxGroupState } from './aria/create-checkbox-group-state'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type {
  CheckboxGroupSlots,
  CheckboxSlots,
  CheckboxVariantProps,
  SlotsToClasses,
} from '@saftox-ui/theme'
import type { JSX } from 'solid-js'

export type CheckboxIconProps = {
  'data-checked': string
  isSelected: boolean
  isIndeterminate: boolean
  disableAnimation: boolean
  class: string
}

interface Props extends Omit<HTMLSaftoxUIProps<'input'>, keyof CheckboxVariantProps> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLLabelElement>
  /**
   * The label of the checkbox.
   */
  children?: JSX.Element
  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The icon to be displayed when the checkbox is checked.
   */
  icon?: JSX.Element | ((props: CheckboxIconProps) => JSX.Element)
  /**
   * React aria onChange event.
   */
  onValueChange?: AriaCheckboxProps['onChange']
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Checkbox classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    icon: "icon-classes",
   *    label: "label-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<CheckboxSlots>
}

export type ContextType = {
  groupState: CheckboxGroupState
  color?: CheckboxProps['color']
  size?: CheckboxProps['size']
  radius?: CheckboxProps['radius']
  isInvalid?: UseCheckboxGroupProps['isInvalid']
  lineThrough?: CheckboxProps['lineThrough']
  isDisabled?: CheckboxProps['isDisabled']
  disableAnimation?: CheckboxProps['disableAnimation']
  validationBehavior?: CheckboxProps['validationBehavior']
}

export type UseCheckboxProps = Omit<Props, 'defaultChecked'> &
  Omit<AriaCheckboxProps, keyof CheckboxVariantProps | 'onChange' | 'onBlur'> &
  CheckboxVariantProps

export interface CheckboxProps extends UseCheckboxProps {}

interface GroupProps extends HTMLSaftoxUIProps<'div'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLDivElement>
  /**
   * The axis the checkbox group items should align with.
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <CheckboxGroup classes={{
   *    base:"base-classes",
   *    label: "label-classes",
   *    wrapper: "wrapper-classes", // checkboxes wrapper
   * }} >
   *  // checkboxes
   * </CheckboxGroup>
   * ```
   */
  classes?: SlotsToClasses<CheckboxGroupSlots>
  /**
   * React aria onChange event.
   */
  onValueChange?: AriaCheckboxGroupProps['onChange']
}

export type UseCheckboxGroupProps = Omit<GroupProps, 'onChange'> &
  AriaCheckboxGroupProps &
  Partial<
    Pick<
      CheckboxProps,
      'color' | 'size' | 'radius' | 'lineThrough' | 'isInvalid' | 'isDisabled' | 'disableAnimation'
    >
  >

export interface CheckboxGroupProps extends UseCheckboxGroupProps {}
