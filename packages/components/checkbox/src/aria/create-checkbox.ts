import type { AriaToggleProps } from '@saftox-ui/toggle'
import type { ToggleState, ToggleStates } from '@saftox-ui/toggle'
import type { DOMAttributes, ValidationResult } from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'

import { createEffect, mergeProps, on, onMount } from 'solid-js'

import {
  createFormValidation,
  createFormValidationState,
  privateValidationStateProp,
} from '@saftox-ui/form'
import { access, combineProps, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { createToggle } from '@saftox-ui/toggle'

export interface AriaCheckboxProps extends AriaToggleProps {
  /**
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean
}

export interface CheckboxAria {
  /** Props for the label wrapper element. */
  labelProps: DOMAttributes | JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props for the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>
  /** The states of the checkbox component. */
  states: ToggleStates
  //
  displayValidation: Accessor<ValidationResult>
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component.
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 * @param props - Props for the checkbox.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckbox(
  props: AriaCheckboxProps,
  state: ToggleState,
  inputRef: Accessor<HTMLInputElement | undefined>,
): CheckboxAria {
  const validationState = createFormValidationState(
    mergeProps(props, {
      get value() {
        return state.isSelected()
      },
    }),
  )

  const displayValidation = () => validationState.displayValidation()

  const { labelProps, inputProps: toggleInputProps, states } = createToggle(props, state, inputRef)

  createFormValidation(props, validationState, inputRef())

  // indeterminate is a property, but it can only be set via javascript
  // https://css-tricks.com/indeterminate-checkboxes/
  createEffect(() => {
    const input = access(inputRef)

    if (input) {
      input.indeterminate = props.isIndeterminate || false
    }
  })

  // Unlike in React, inputs `indeterminate` state can be out of sync with our `props.isIndeterminate`.
  // Clicking on the input will change its internal `indeterminate` state.
  // To prevent this, we need to force the input `indeterminate` state to be in sync with our `props.isIndeterminate`.
  createEffect(
    on(
      () => state.isSelected(),
      () => {
        const input = access(inputRef)

        if (input) {
          input.indeterminate = props.isIndeterminate || false
        }
      },
    ),
  )

  const inputProps = mergeProps(toggleInputProps, {
    get checked() {
      return state.isSelected()
    },
    get 'aria-checked'() {
      return props.isIndeterminate ? 'mixed' : state.isSelected()
    },
    required: props.isRequired && props.validationBehavior === 'native',
  })

  return {
    labelProps,
    inputProps,
    states,
    displayValidation,
  }
}
