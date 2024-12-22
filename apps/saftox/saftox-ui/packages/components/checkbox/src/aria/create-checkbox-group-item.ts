import type { AriaCheckboxProps } from './create-checkbox'
import type { CheckboxAria } from './create-checkbox'
import type { CheckboxGroupState } from './create-checkbox-group-state'
import type { ValidationResult } from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { createCheckbox } from './create-checkbox'

import { createEffect, createSignal, mergeProps } from 'solid-js'

import {
  createFormValidationState,
  DEFAULT_VALIDATION_RESULT,
  privateValidationStateProp,
} from '@saftox-ui/form'
import { pickProps } from '@saftox-ui/solid-utils/reactivity'
import { createToggleState } from '@saftox-ui/toggle'

export interface AriaCheckboxGroupItemProps
  extends Omit<AriaCheckboxProps, 'isSelected' | 'defaultSelected'> {
  value: string
}

interface CheckboxGroupData {
  name?: string
  descriptionId?: string
  errorMessageId?: string
  validationBehavior: 'aria' | 'native'
}

/**
 * Provides the behavior and accessibility implementation for a checkbox component contained within a checkbox group.
 * Checkbox groups allow users to select multiple items from a list of options.
 * @param props - Props for the checkbox.
 * @param state - State for the checkbox, as returned by `createCheckboxGroupState`.
 * @param inputRef - A ref for the HTML input element.
 */
export function createCheckboxGroupItem(
  props: AriaCheckboxGroupItemProps,
  state: CheckboxGroupState,
  inputRef: Accessor<HTMLInputElement | undefined>,
): CheckboxAria {
  const toggleState = createToggleState({
    get isReadOnly() {
      return props.isReadOnly || state.isReadOnly()
    },
    get isSelected() {
      return state.isSelected(props.value)
    },
    onChange: (isSelected: boolean) => {
      if (isSelected) {
        state.addValue(props.value)
      } else {
        state.removeValue(props.value)
      }

      if (props.onChange) {
        props.onChange(isSelected)
      }
    },
  })

  // let { name, descriptionId, errorMessageId, validationBehavior } = checkboxGroupData.get(state)!

  const stateProps = pickProps(state as CheckboxGroupState & CheckboxGroupData, [
    'name',
    'descriptionId',
    'errorMessageId',
    'validationBehavior',
  ])

  const validationBehavior = props.validationBehavior ?? stateProps.validationBehavior

  // Local validation for this checkbox
  const { realtimeValidation } = createFormValidationState(
    mergeProps(props as any, {
      get value() {
        return props.value
      },
      // Server validation is handled at the group level.
      name: undefined,
      validationBehavior: 'aria' as const,
    }),
  )

  let nativeValidation: ValidationResult = DEFAULT_VALIDATION_RESULT
  const updateValidation = () => {
    state.setInvalid(
      props.value,
      realtimeValidation().isInvalid ? realtimeValidation() : nativeValidation,
    )
  }

  createEffect(updateValidation)

  // combine group and checkbox validation
  const combinedRealtimeValidation = () =>
    state.realtimeValidation().isInvalid ? state.realtimeValidation : realtimeValidation()
  const displayValidation = () =>
    validationBehavior === 'native' ? state.displayValidation : combinedRealtimeValidation

  const checkbox = createCheckbox(
    mergeProps(props as any, {
      get isReadOnly() {
        return props.isReadOnly || state.isReadOnly()
      },
      get isDisabled() {
        return props.isDisabled || state.isDisabled()
      },
      get name() {
        return props.name || stateProps.name
      },
      get isRequired() {
        return props.isRequired || state.isRequired()
      },
      validationBehavior,
      get [privateValidationStateProp]() {
        return {
          get realtimeValidation() {
            return combinedRealtimeValidation
          },
          get displayValidation() {
            return displayValidation()
          },
          get resetValidation() {
            return state.resetValidation
          },
          get commitValidation() {
            return state.commitValidation
          },
          updateValidation(v: ValidationResult) {
            nativeValidation = v
            updateValidation()
          },
        }
      },
    }),
    toggleState,
    inputRef,
  )

  return mergeProps(checkbox, {
    get inputProps() {
      return mergeProps(checkbox.inputProps, {
        get 'aria-describedby'() {
          return (
            [
              props['aria-describedby'],
              state.isInvalid() ? stateProps.errorMessageId : null,
              stateProps.descriptionId,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          )
        },
      })
    },
  })
}
