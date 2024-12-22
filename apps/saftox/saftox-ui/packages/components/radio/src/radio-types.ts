import type { AriaRadioGroupProps, AriaRadioProps } from './aria'
import type { RadioGroupState } from './aria/create-radio-group-state'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type {
  RadioGroupSlots,
  RadioSlots,
  RadioVariantProps,
  SlotsToClasses,
} from '@saftox-ui/theme'
import type { Orientation } from '@saftox-ui/types'
import type { JSX } from 'solid-js'

interface Props extends Omit<HTMLSaftoxUIProps<'input'>, keyof RadioVariantProps> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The radio description text.
   */
  description?: JSX.Element
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Radio classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    control: "control-classes", // inner circle
   *    labelWrapper: "label-wrapper-classes", // this wraps the label and description
   *    label: "label-classes",
   *    description: "description-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<RadioSlots>
}

export type UseRadioProps = Omit<Props, 'defaultChecked'> &
  Omit<AriaRadioProps, keyof RadioVariantProps> &
  RadioVariantProps

export interface RadioProps extends UseRadioProps {}

interface GroupProps extends Omit<HTMLSaftoxUIProps<'div'>, 'onChange'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The axis the radio group items should align with.
   * @default "vertical"
   */
  orientation?: Orientation
  /**
   * Classname or List of classes to change the classes of the element.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <RadioGroup classes={{
   *    base:"base-classes",
   *    label: "label-classes",
   *    wrapper: "wrapper-classes", // radios wrapper
   * }} >
   *  // radios
   * </RadioGroup>
   * ```
   */
  classes?: SlotsToClasses<RadioGroupSlots>
  /**
   * React aria onChange event.
   */
  onValueChange?: AriaRadioGroupProps['onChange']
}

export type UseRadioGroupProps = Omit<GroupProps, 'defaultChecked'> &
  Omit<AriaRadioGroupProps, 'onChange'> &
  Partial<Pick<RadioProps, 'color' | 'size' | 'isDisabled' | 'disableAnimation' | 'onChange'>>

export interface RadioGroupProps extends Omit<UseRadioGroupProps, 'defaultChecked'> {}

export type ContextType = {
  groupState: RadioGroupState
  isRequired?: UseRadioGroupProps['isRequired']
  isInvalid?: UseRadioGroupProps['isInvalid']
  color?: RadioProps['color']
  size?: RadioProps['size']
  isDisabled?: RadioProps['isDisabled']
  disableAnimation?: RadioProps['disableAnimation']
  onChange?: RadioProps['onChange']
}
