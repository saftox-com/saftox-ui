import type { FocusWithinEvents } from '@saftox-ui/types'
import type { MaybeAccessor } from '@solid-primitives/utils'

import { access } from '@solid-primitives/utils'

import { createSyntheticBlurEvent } from './utils'

import { createSignal } from 'solid-js'

export interface CreateFocusWithinProps extends FocusWithinEvents {
  /**
   * Whether the focus within events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>
}

type FocusWithinProps = Required<Pick<FocusWithinEvents, 'onFocusIn' | 'onFocusOut'>>

export interface FocusWithinResult {
  /**
   * Props to spread onto the target element.
   */
  focusWithinProps: FocusWithinProps
}

/**
 * Handles focus events for the target and its descendants.
 */
export function createFocusWithin(props: CreateFocusWithinProps): FocusWithinResult {
  const [isFocusWithin, setIsFocusWithin] = createSignal(false)

  const isDisabled = () => access(props.isDisabled) ?? false

  const onFocusOut = (e: FocusEvent) => {
    if (isDisabled()) {
      return
    }

    const currentTarget = e.currentTarget as Element | null
    const relatedTarget = e.relatedTarget as Element | null

    // We don't want to trigger onFocusOut and then immediately onFocusIn again
    // when moving focus inside the element. Only trigger if the currentTarget doesn't
    // include the relatedTarget (where focus is moving).
    if (isFocusWithin() && !currentTarget?.contains(relatedTarget)) {
      setIsFocusWithin(false)
      props.onFocusOut?.(e)
      props.onFocusWithinChange?.(false)
    }
  }

  const onSyntheticFocus = createSyntheticBlurEvent(onFocusOut)

  const onFocusIn = (e: FocusEvent) => {
    if (isDisabled()) {
      return
    }

    if (!isFocusWithin()) {
      props.onFocusIn?.(e)
      props.onFocusWithinChange?.(true)
      setIsFocusWithin(true)
      onSyntheticFocus(e)
    }
  }

  const focusWithinProps: FocusWithinProps = {
    onFocusIn,
    onFocusOut,
  }

  return { focusWithinProps }
}
