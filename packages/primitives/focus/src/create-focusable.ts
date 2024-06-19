import type { CreateFocusProps, CreateKeyboardProps } from '@saftox-ui/interactions'
import type { MaybeAccessor } from '@solid-primitives/utils'
import type { Accessor, JSX } from 'solid-js'

import { combineProps } from '@solid-primitives/props'
import { access } from '@solid-primitives/utils'

import { createSignal, onMount } from 'solid-js'

import { createFocus, createKeyboard } from '@saftox-ui/interactions'

export interface CreateFocusableProps extends CreateFocusProps, CreateKeyboardProps {
  /**
   * Whether focus should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>

  /**
   * Whether the element should receive focus on render.
   */
  autofocus?: MaybeAccessor<boolean | undefined>

  /**
   * Whether to exclude the element from the sequential tab order. If true,
   * the element will not be focusable via the keyboard by tabbing. This should
   * be avoided except in rare scenarios where an alternative means of accessing
   * the element or its functionality via the keyboard is available.
   */
  excludeFromTabOrder?: MaybeAccessor<boolean | undefined>
}

export interface FocusableResult {
  /**
   * Props to spread onto the target element.
   */
  focusableProps: JSX.HTMLAttributes<any>
}

// TODO: add all the focus provider stuff when needed

/**
 * Make an element focusable, capable of auto focus and excludable from tab order.
 */
export function createFocusable(
  props: CreateFocusableProps,
  ref: Accessor<HTMLElement | undefined>,
): FocusableResult {
  const [autofocus, setAutofocus] = createSignal(!!access(props.autofocus))

  const { focusProps } = createFocus(props)
  const { keyboardProps } = createKeyboard(props)

  const focusableProps = {
    ...combineProps(focusProps, keyboardProps),
    get tabIndex() {
      return access(props.excludeFromTabOrder) && !access(props.isDisabled) ? -1 : undefined
    },
  }

  onMount(() => {
    autofocus() && access(ref)?.focus()
    setAutofocus(false)
  })

  return { focusableProps }
}
