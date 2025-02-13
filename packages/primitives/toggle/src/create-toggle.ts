import type { ToggleState } from './create-toggle-state'
import type {
  AriaLabelingProps,
  AriaValidationProps,
  FocusableDOMProps,
  FocusableProps,
  InputBase,
  Validation,
} from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'

import { mergeProps } from 'solid-js'

import { createFocusable } from '@saftox-ui/focus'
import { createPress } from '@saftox-ui/interactions'
import { issueWarning } from '@saftox-ui/shared-utils'
import { filterDOMProps } from '@saftox-ui/utils'

export interface ToggleProps extends InputBase, Validation<boolean>, FocusableProps {
  /**
   * The label for the element.
   */
  children?: JSX.Element
  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean
  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean
  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * The value of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string
}

export interface AriaToggleProps
  extends ToggleProps,
    FocusableDOMProps,
    AriaLabelingProps,
    AriaValidationProps {
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  'aria-controls'?: string

  /**
   * The name of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string
}

export interface ToggleStates {
  /** Whether the toggle is selected. */
  isSelected: boolean
  /** Whether the toggle is in a pressed state. */
  isPressed: boolean
  /** Whether the toggle is disabled. */
  isDisabled: boolean
  /** Whether the toggle is read only. */
  isReadOnly: boolean
  /** Whether the toggle is invalid. */
  isInvalid: boolean
}

export interface ToggleAria {
  /** Props to be spread on the label element. */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props to be spread on the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>
  /** The states of the toggle component. */
  states: ToggleStates
}

/**
 * Handles interactions for toggle elements, e.g. Checkboxes and Switches.
 * @param props - Props for the toggle element.
 * @param inputRef - Ref to the HTML input element.
 */
export function createToggle(
  originalProps: AriaToggleProps,
  state: ToggleState,
  inputRef: Accessor<HTMLInputElement | undefined>,
): ToggleAria {
  const defaultProps = {
    isDisabled: false,
    isReadOnly: false,
    validationState: 'valid',
  }

  const props = mergeProps(defaultProps, originalProps)

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    event.stopPropagation()
    const target = event.target as HTMLInputElement
    state.setSelected(target.checked)

    // Ensure input `checked` state is in sync with the toggle state.
    target.checked = state.isSelected()
  }

  const hasChildren = 'children' in props
  const hasAriaLabel = 'aria-label' in props || 'ariaLabelledby' in props
  if (!hasChildren && !hasAriaLabel) {
    issueWarning('If you do not provide children, you must specify an aria-label for accessibility')
  }

  // This handles focusing the input on pointer down, which Safari does not do by default.
  const { pressProps, isPressed } = createPress<HTMLInputElement>({
    get isDisabled() {
      return props.isDisabled
    },
  })

  // iOS does not toggle checkboxes if you drag off and back onto the label, so handle it ourselves.
  const { pressProps: labelPressProps, isPressed: isLabelPressed } = createPress<HTMLLabelElement>({
    get isDisabled() {
      return props.isDisabled || props.isReadOnly
    },
    onPress() {
      state.toggle()
    },
  })

  const { focusableProps } = createFocusable(props, inputRef)
  const interactions = mergeProps(pressProps, focusableProps)
  const domProps = filterDOMProps(props, { labelable: true })

  const baseToggleProps: JSX.InputHTMLAttributes<any> = {
    type: 'checkbox',
    get 'aria-invalid'() {
      return props.isInvalid || props.validationState === 'invalid' || undefined
    },
    get 'aria-errormessage'() {
      return props['aria-errormessage']
    },
    get 'aria-controls'() {
      return props['aria-controls']
    },
    get 'aria-readonly'() {
      return props.isReadOnly || undefined
    },
    get 'aria-required'() {
      return props.isRequired || undefined
    },
    get disabled() {
      return props.isDisabled
    },
    get value() {
      return props.value
    },
    get name() {
      return props.name
    },
    onChange,
  }

  const inputProps = mergeProps(domProps, baseToggleProps, interactions)
  const labelProps = mergeProps(labelPressProps, {
    onClick: (e: Event) => e.preventDefault(),
  })

  const states = {
    get isPressed() {
      return isPressed() || isLabelPressed()
    },
    get isSelected() {
      return state.isSelected()
    },
    get isDisabled() {
      return props.isDisabled
    },
    get isReadOnly() {
      return props.isReadOnly
    },
    get isInvalid() {
      return props.isInvalid || props.validationState === 'invalid'
    },
  }

  return {
    labelProps,
    inputProps,
    states,
  }
}
