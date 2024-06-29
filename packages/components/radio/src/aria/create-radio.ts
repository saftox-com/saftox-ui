import type { RadioGroupState } from './create-radio-group-state'
import type { AriaRadioProps } from './index'
import type { CreateFocusableProps } from '@saftox-ui/focus'
import type { Accessor, JSX } from 'solid-js'

import { createMemo, mergeProps } from 'solid-js'

import { createFocusable } from '@saftox-ui/focus'
import { createFormValidation } from '@saftox-ui/form'
import { createPress } from '@saftox-ui/interactions'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { filterDOMProps } from '@saftox-ui/utils'

export interface RadioAriaStates {
  /** Whether the radio is disabled. */
  isDisabled: boolean
  /** Whether the radio is currently selected. */
  isSelected: boolean
  /** Whether the radio is in a pressed state. */
  isPressed: boolean
}

export interface RadioAria {
  /** Props for the label wrapper element. */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props for the input element. */
  inputProps: JSX.InputHTMLAttributes<HTMLInputElement>
  /**  */
  states: RadioAriaStates
}

/**
 * Provides the behavior and accessibility implementation for an individual
 * radio button in a radio group.
 * @param props - Props for the radio.
 * @param state
 * @param inputRef - Ref to the HTML input element.
 */
export function createRadio(
  props: AriaRadioProps,
  state: RadioGroupState,
  inputRef: Accessor<HTMLInputElement | undefined>,
): RadioAria {
  const hasChildren = 'children' in props && props.children != null
  const hasAriaLabel = props['aria-label'] != null || props['aria-labelledby'] != null
  if (!hasChildren && !hasAriaLabel) {
    console.warn('If you do not provide children, you must specify an aria-label for accessibility')
  }

  const states = {
    get isDisabled() {
      return props.isDisabled || state.states.isDisabled
    },
    get isPressed() {
      return isPressed() || isLabelPressed()
    },
    get isSelected() {
      return state.states.selectedValue === props.value
    },
  }

  const onChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    event.stopPropagation()
    state.setSelectedValue(props.value)

    const target = event.target as HTMLInputElement
    target.checked = states.isSelected
  }

  const { pressProps, isPressed } = createPress({
    isDisabled: () => props.isDisabled,
  })

  // iOS does not toggle radios if you drag off and back onto the label, so handle it ourselves.
  const { pressProps: labelPressProps, isPressed: isLabelPressed } = createPress<HTMLLabelElement>({
    isDisabled: () => props.isDisabled,
    onPress: () => state.setSelectedValue(props.value),
  })

  const createFocusableProps = combineProps(props, {
    onFocus: () => state.setLastFocusedValue(props.value),
  } as CreateFocusableProps)

  const { focusableProps } = createFocusable(createFocusableProps, inputRef)

  const interactions = combineProps(pressProps, focusableProps)
  const domProps = mergeProps(createMemo(() => filterDOMProps(props, { labelable: true })))

  const labelProps = combineProps(labelPressProps, {
    onClick: (e: any) => e.preventDefault(),
  })

  const inputProps = combineProps(
    domProps,
    mergeProps(interactions, {
      type: 'radio',
      name: state.name(),
      get tabIndex() {
        if (states.isDisabled) {
          return undefined
        }
        return state.states.lastFocusedValue === props.value ||
          state.states.lastFocusedValue == null
          ? 0
          : -1
      },
      get disabled() {
        return states.isDisabled
      },
      get required() {
        return state.states.isRequired
      },
      get checked() {
        return states.isSelected
      },
      get value() {
        return props.value
      },
      onChange,
    }),
  )

  return { labelProps, inputProps, states }
}
