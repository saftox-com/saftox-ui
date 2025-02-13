import type { FocusEvents } from '@saftox-ui/types'
import type { MaybeAccessor } from '@solid-primitives/utils'

import { access } from '@solid-primitives/utils'

import { createSyntheticBlurEvent } from './utils'

export interface CreateFocusProps extends FocusEvents {
  /**
   * Whether the focus events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>
}

type FocusProps = Required<Pick<FocusEvents, 'onFocus' | 'onBlur'>>

export interface FocusResult {
  /**
   * Props to spread onto the target element.
   */
  focusProps: FocusProps
}

/**
 * Handles focus events for the immediate target.
 * Focus events on child elements will be ignored.
 */
export function createFocus(props: CreateFocusProps): FocusResult {
  const isDisabled = () => access(props.isDisabled) ?? false

  const onBlur = (e: FocusEvent) => {
    if (isDisabled() || (!props.onBlur && !props.onFocusChange)) {
      return
    }

    props.onBlur?.(e)
    props.onFocusChange?.(false)
  }

  const onSyntheticFocus = createSyntheticBlurEvent(onBlur)

  const onFocus = (e: FocusEvent) => {
    if (isDisabled() || (!props.onFocus && !props.onBlur && !props.onFocusChange)) {
      return
    }

    props.onFocus?.(e)
    props.onFocusChange?.(true)
    onSyntheticFocus(e)
  }

  const focusProps: FocusProps = {
    onFocus,
    onBlur,
  }

  return { focusProps }
}
