import type { AriaSwitchProps, SwitchAria } from './index'
import type { ToggleState } from '@saftox-ui/toggle'
import type { Accessor, JSX } from 'solid-js'

import { mergeProps } from 'solid-js'

import { createToggle } from '@saftox-ui/toggle'

/**
 * Provides the behavior and accessibility implementation for a switch component.
 * A switch is similar to a checkbox, but represents on/off values as opposed to selection.
 * @param props - Props for the switch.
 * @param inputRef - Ref to the HTML input element.
 */
export function createSwitch(
  props: AriaSwitchProps,
  state: ToggleState,
  inputRef: Accessor<HTMLInputElement | undefined>,
): SwitchAria {
  const { labelProps, inputProps: toggleInputProps, states } = createToggle(props, state, inputRef)

  const inputProps = mergeProps(toggleInputProps, {
    role: 'switch',
    get checked() {
      return states.isSelected
    },
    get 'aria-checked'() {
      return states.isSelected
    },
  } as JSX.InputHTMLAttributes<HTMLInputElement>)

  return { labelProps, inputProps, states }
}
