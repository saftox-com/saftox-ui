import type { ToggleState } from '@saftox-ui/toggle'
import type { ElementType } from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'
import type { AriaToggleButtonProps } from './button-types'
import type { ButtonAria } from './create-button'

import { chain, combineProps } from '@saftox-ui/solid-utils/reactivity'
import { createToggleState } from '@saftox-ui/toggle'
import { mergeProps } from 'solid-js'

import { createButton } from './create-button'

export interface ToggleButtonAria<T> extends ButtonAria<T> {
  /**
   * State for the toggle button, as returned by `createToggleState`.
   */
  state: ToggleState
}

export function createToggleButton(
  props: AriaToggleButtonProps<'a'>,
  ref: Accessor<HTMLAnchorElement | undefined>,
): ToggleButtonAria<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>

export function createToggleButton(
  props: AriaToggleButtonProps<'button'>,
  ref: Accessor<HTMLButtonElement | undefined>,
): ToggleButtonAria<JSX.ButtonHTMLAttributes<HTMLButtonElement>>

export function createToggleButton(
  props: AriaToggleButtonProps<'div'>,
  ref: Accessor<HTMLDivElement | undefined>,
): ToggleButtonAria<JSX.HTMLAttributes<HTMLDivElement>>

export function createToggleButton(
  props: AriaToggleButtonProps<'input'>,
  ref: Accessor<HTMLInputElement | undefined>,
): ToggleButtonAria<JSX.InputHTMLAttributes<HTMLInputElement>>

export function createToggleButton(
  props: AriaToggleButtonProps<'span'>,
  ref: Accessor<HTMLSpanElement | undefined>,
): ToggleButtonAria<JSX.HTMLAttributes<HTMLSpanElement>>

export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<HTMLElement | undefined>,
): ToggleButtonAria<JSX.HTMLAttributes<HTMLElement>>

/**
 * Provides the behavior and accessibility implementation for a toggle button component.
 * ToggleButtons allow users to toggle a selection on or off, for example switching between two states or modes.
 * @param props - Props to be applied to the button.
 * @param ref - A ref to a DOM element for the button.
 */
export function createToggleButton(
  props: AriaToggleButtonProps<ElementType>,
  ref: Accessor<any>,
): ToggleButtonAria<JSX.HTMLAttributes<any>> {
  const state = createToggleState(props)

  const createButtonProps = mergeProps(props, {
    onPress: chain([state.toggle, props.onPress]),
  })

  const { isPressed, buttonProps } = createButton(createButtonProps, ref)

  const toggleButtonProps: JSX.HTMLAttributes<any> = {
    get 'aria-pressed'() {
      return state.isSelected()
    },
  }

  return {
    buttonProps: combineProps(buttonProps, toggleButtonProps),
    isPressed,
    state,
  }
}
