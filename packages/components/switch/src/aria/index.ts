export * from './create-switch'

import type { AriaToggleProps, ToggleStates } from '@saftox-ui/toggle'
import type {
  AriaLabelingProps,
  FocusableDOMProps,
  FocusableProps,
  InputBase,
} from '@saftox-ui/types'
import type { JSX } from 'solid-js'

interface SwitchBase extends InputBase, FocusableProps {
  /**
   * The content to render as the Switch's label.
   */
  children?: JSX.Element
  /**
   * Whether the Switch should be selected (uncontrolled).
   */
  defaultSelected?: boolean
  /**
   * Whether the Switch should be selected (controlled).
   */
  isSelected?: boolean
  /**
   * Handler that is called when the Switch's selection state changes.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * The value of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string
}
export interface SwitchProps extends SwitchBase {}
export interface AriaSwitchBase extends SwitchBase, FocusableDOMProps, AriaLabelingProps {
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  'aria-controls'?: string

  /**
   * The name of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string
}
export interface AriaSwitchProps extends SwitchProps, AriaSwitchBase {}

export interface SwitchAria {
  /** Props to be spread on the label element. */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props to be spread on the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>
  /** The states of the toggle component. */
  states: ToggleStates
}
