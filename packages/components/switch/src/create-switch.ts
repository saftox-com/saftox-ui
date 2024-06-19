import type { Accessor, JSX } from 'solid-js'
import type { AriaSwitchProps, SwitchAria } from './switch-types'

import { createToggle } from '@saftox-ui/toggle'
import { mergeProps } from 'solid-js'

/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 * @param props - Props for the switch.
 * @param inputRef - Ref to the HTML input element.
 */
export function createSwitch(
  props: AriaSwitchProps,
  inputRef: Accessor<HTMLInputElement | undefined>,
): SwitchAria {
  const { inputProps: toggleInputProps, isPressed, state } = createToggle(props, inputRef)

  const inputProps = mergeProps(toggleInputProps, {
    role: 'switch',
    get checked() {
      return state.isSelected()
    },
    get 'aria-checked'() {
      return state.isSelected()
    },
  } as JSX.InputHTMLAttributes<HTMLInputElement>)

  return { inputProps, isPressed, state }
}
