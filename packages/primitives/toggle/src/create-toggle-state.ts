import type { ToggleProps } from './create-toggle'
import type { MaybeAccessor } from '@saftox-ui/solid-utils/reactivity'
import type { Accessor } from 'solid-js'

import { access } from '@saftox-ui/solid-utils/reactivity'
import { createControllableBooleanSignal } from '@saftox-ui/utils'

export interface ToggleStateOptions extends Omit<ToggleProps, 'children'> {}

export interface ToggleState {
  /** Whether the toggle is selected. */
  readonly isSelected: Accessor<boolean>
  /** Updates selection state. */
  setSelected: (isSelected: boolean) => void
  /** Toggle the selection state. */
  toggle: () => void
}

/**
 * Provides state management for toggle components like checkboxes and switches.
 */
export function createToggleState(props: ToggleStateOptions = {}): ToggleState {
  const [isSelected, _setSelected] = createControllableBooleanSignal({
    value: () => access(props.isSelected),
    defaultValue: () => !!access(props.defaultSelected),
    onChange: props.onChange,
  })

  const setSelected = (value: boolean) => {
    if (!access(props.isReadOnly)) {
      _setSelected(value)
    }
  }

  const toggle = () => {
    if (!access(props.isReadOnly)) {
      _setSelected(!isSelected())
    }
  }

  return { isSelected, setSelected, toggle }
}
