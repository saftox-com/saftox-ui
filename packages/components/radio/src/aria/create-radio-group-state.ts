import type { RadioGroupProps } from './index'
import type { FormValidationState } from '@saftox-ui/form'
import type { MaybeAccessor } from '@saftox-ui/solid-utils/reactivity'
import type { ValidationState } from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { createSignal, mergeProps } from 'solid-js'

import { createFormValidationState } from '@saftox-ui/form'
import { access } from '@saftox-ui/solid-utils/reactivity'
import { createControllableSignal } from '@saftox-ui/utils'

export interface RadioGroupStateStates {
  /** Whether the radio group is disabled. */
  readonly isDisabled: boolean
  /** Whether the radio group is read only. */
  readonly isReadOnly: boolean
  /** Whether the radio group is required. */
  readonly isRequired: boolean
  /** Whether the radio group is invalid. */
  readonly isInvalid: boolean
  /** The currently selected value. */
  readonly selectedValue: string | null
  /**
   * Whether the radio group is valid or invalid.
   * @deprecated Use `isInvalid` instead.
   */
  readonly validationState: ValidationState | null
  /** The value of the last focused radio. */
  readonly lastFocusedValue: string | null
}

export interface RadioGroupState extends FormValidationState {
  /**
   * The name for the group, used for native form submission.
   * @deprecated
   * @private
   */
  readonly name: Accessor<string>
  /** Sets the selected value. */
  setSelectedValue(value: string | null): void
  /** Sets the last focused value. */
  setLastFocusedValue(value: string | null): void
  /**  */
  states: RadioGroupStateStates
}

const instance = Math.round(Math.random() * 10000000000)
let i = 0

/**
 * Provides state management for a radio group component.
 * Provides a name for the group, and manages selection and focus state.
 */
export function createRadioGroupState(props: RadioGroupProps): RadioGroupState {
  const name = () => props.name || `radio-group-${instance}-${++i}`
  const [selectedValue, setSelected] = createControllableSignal({
    value: () => props.value,
    defaultValue: () => props.defaultValue ?? null,
    onChange: (value) => value && props.onChange?.(value),
  })

  const [lastFocusedValue, setLastFocusedValue] = createSignal<string | null>(null)

  const validation = createFormValidationState(
    mergeProps(props, {
      get value() {
        return selectedValue()
      },
    }),
  )

  const states: RadioGroupStateStates = {
    get isDisabled() {
      return props.isDisabled || false
    },
    get isReadOnly() {
      return props.isReadOnly || false
    },
    get isRequired() {
      return props.isRequired || false
    },
    get selectedValue() {
      return selectedValue() || null
    },
    get isInvalid() {
      return validation.displayValidation().isInvalid
    },
    get validationState() {
      return props.validationState || (this.isInvalid ? 'invalid' : null)
    },
    get lastFocusedValue() {
      return lastFocusedValue()
    },
  }

  const setSelectedValue = (value: string) => {
    if (states.isReadOnly || states.isDisabled) {
      return
    }

    setSelected(value)
    validation.commitValidation()
  }

  return mergeProps(validation, {
    name,
    setSelectedValue,
    setLastFocusedValue,
    states,
  })
}
