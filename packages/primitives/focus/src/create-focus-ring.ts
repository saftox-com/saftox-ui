import type { FocusResult, FocusWithinResult } from '@saftox-ui/interactions'
import type { MaybeAccessor } from '@solid-primitives/utils'
import type { Accessor } from 'solid-js'

import { access } from '@solid-primitives/utils'

import { createMemo, createSignal, mergeProps } from 'solid-js'

import {
  createFocus,
  createFocusVisibleListener,
  createFocusWithin,
  isKeyboardFocusVisible,
} from '@saftox-ui/interactions'

export interface CreateFocusRingProps {
  /**
   * Whether to show the focus ring when something
   * inside the container element has focus (true), or
   * only if the container itself has focus (false).
   * @default 'false'
   */
  within?: MaybeAccessor<boolean | undefined>

  /**
   * Whether the element is a text input.
   */
  isTextInput?: MaybeAccessor<boolean | undefined>

  /**
   * Whether the element will be auto focused.
   */
  autofocus?: MaybeAccessor<boolean | undefined>
}

type FocusRingProps = FocusResult['focusProps'] | FocusWithinResult['focusWithinProps']

export interface FocusRingResult {
  /**
   * Whether the element is currently focused.
   */
  isFocused: Accessor<boolean>

  /**
   * Whether keyboard focus should be visible.
   */
  isFocusVisible: Accessor<boolean>

  /**
   * Props to apply to the container element with the focus ring.
   */
  focusProps: FocusRingProps
}

/**
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are visible only when the user is interacting with a keyboard,
 * not with a mouse, touch, or other input methods.
 */
export function createFocusRing(props: CreateFocusRingProps = {}): FocusRingResult {
  const [isFocused, setFocused] = createSignal(false)
  const [isFocusVisibleState, setFocusVisibleState] = createSignal(
    access(props.autofocus) || isKeyboardFocusVisible(),
  )

  const isFocusVisible = () => isFocused() && isFocusVisibleState()

  createFocusVisibleListener(
    setFocusVisibleState,
    () => null, // hack for passing a dep that never changes
    { isTextInput: !!access(props.isTextInput) },
  )

  const { focusProps } = createFocus({
    isDisabled: () => access(props.within),
    onFocusChange: setFocused,
  })

  const { focusWithinProps } = createFocusWithin({
    isDisabled: () => !access(props.within),
    onFocusWithinChange: setFocused,
  })

  const focusRingProps = createMemo(() => (access(props.within) ? focusWithinProps : focusProps))

  return {
    isFocused,
    isFocusVisible,
    focusProps: mergeProps(focusRingProps),
  }
}
