import type { CheckboxGroupProps } from './create-checkbox-group'
import type { FormValidationState } from '@saftox-ui/form'
import type { MaybeAccessor } from '@saftox-ui/solid-utils/reactivity'
import type { ValidationResult, ValidationState } from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { mergeProps } from 'solid-js'

import { createFormValidationState, mergeValidation } from '@saftox-ui/form'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { access } from '@saftox-ui/solid-utils/reactivity'
import { createControllableArraySignal } from '@saftox-ui/utils'

export interface CheckboxGroupState extends FormValidationState {
  // /** Current selected values. */
  readonly value: Accessor<readonly string[]>
  // /** Whether the checkbox group is disabled. */
  readonly isDisabled: Accessor<boolean>
  // /** Whether the checkbox group is read only. */
  readonly isReadOnly: Accessor<boolean>
  // /**
  //  * The current validation state of the checkbox group.
  //  * @deprecated Use `isInvalid` instead.
  //  */
  readonly validationState: ValidationState | null
  // /** Whether the checkbox group is invalid. */
  readonly isInvalid: Accessor<boolean>
  // /**
  //  * Whether the checkboxes in the group are required.
  //  * This changes to false once at least one item is selected.
  //  */
  readonly isRequired: Accessor<boolean>
  // /** Returns whether the given value is selected. */
  isSelected(value: string): boolean
  // /** Sets the selected values. */
  setValue(value: string[]): void
  // /** Adds a value to the set of selected values. */
  addValue(value: string): void
  // /** Removes a value from the set of selected values. */
  removeValue(value: string): void
  // /** Toggles a value in the set of selected values. */
  toggleValue(value: string): void
  // /** Sets whether one of the checkboxes is invalid. */
  setInvalid(value: string, validation: ValidationResult): void
}

/**
 * Provides state management for a checkbox group component.
 */
export function createCheckboxGroupState(props: CheckboxGroupProps = {}): CheckboxGroupState {
  const [selectedValues, setSelectedValues] = createControllableArraySignal<string>({
    value: () => access(props.value),
    defaultValue: () => access(props.defaultValue) || [],
    onChange: props.onChange,
  })
  const isRequired = () => !!props.isRequired && selectedValues().length === 0

  let invalidValues = new Map<string, ValidationResult>()
  const validation = createFormValidationState(
    mergeProps(props, {
      get value() {
        return selectedValues()
      },
    }),
  )

  const isInvalid = () => validation.displayValidation.isInvalid

  const addToSelectedValues = (value: string) => {
    setSelectedValues(selectedValues().concat(value))
  }

  const removeFromSelectedValues = (value: string) => {
    setSelectedValues(selectedValues().filter((existingValue) => existingValue !== value))
  }

  const isDisabled = () => {
    return access(props.isDisabled) || false
  }

  const isReadOnly = () => {
    return access(props.isReadOnly) || false
  }

  const isSelected = (value: string) => {
    return selectedValues().includes(value)
  }

  const setValue = (value: string[]) => {
    if (isDisabled() || isReadOnly()) {
      return
    }

    setSelectedValues(value)
  }

  const addValue = (value: string) => {
    if (isDisabled() || isReadOnly() || isSelected(value)) {
      return
    }

    addToSelectedValues(value)
  }

  const removeValue = (value: string) => {
    if (isDisabled() || isReadOnly() || !isSelected(value)) {
      return
    }

    removeFromSelectedValues(value)
  }

  const toggleValue = (value: string) => {
    if (isDisabled() || isReadOnly()) {
      return
    }

    isSelected(value) ? removeFromSelectedValues(value) : addToSelectedValues(value)
  }

  const setInvalid = (value: string, v: ValidationResult) => {
    const s = new Map(invalidValues)

    if (v.isInvalid) {
      s.set(value, v)
    } else {
      s.delete(value)
    }

    invalidValues = s
    validation.updateValidation(mergeValidation(...s.values()))
  }

  return combineProps(validation, {
    value: selectedValues,
    isDisabled,
    isReadOnly,
    get validationState() {
      return props.validationState ?? (isInvalid() ? 'invalid' : null)
    },
    isInvalid,
    isRequired,
    isSelected,
    setValue,
    addValue,
    removeValue,
    toggleValue,
    setInvalid,
  })
}
