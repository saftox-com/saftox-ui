export * from './create-radio'
export * from './create-radio-group'
export * from './create-radio-group-state'

import type {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  FocusableProps,
  FocusEvents,
  HelpTextProps,
  InputBase,
  InputDOMProps,
  LabelableProps,
  Orientation,
  Validation,
  ValueBase,
} from '@saftox-ui/types'
import type { JSX } from 'solid-js'

export interface RadioGroupProps
  extends ValueBase<string | null, string>,
    InputBase,
    InputDOMProps,
    Validation<string | null>,
    LabelableProps,
    HelpTextProps,
    FocusEvents {
  /**
   * The axis the Radio Button(s) should align with.
   * @default 'vertical'
   */
  orientation?: Orientation
}

export interface RadioProps extends FocusableProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string
  /**
   * The label for the Radio. Accepts any renderable node.
   */
  children?: JSX.Element
  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean
}

export interface AriaRadioGroupProps
  extends RadioGroupProps,
    DOMProps,
    AriaLabelingProps,
    AriaValidationProps {}

export interface AriaRadioProps extends RadioProps, DOMProps, AriaLabelingProps {}
