import type {
  AriaLabelingProps,
  DOMAttributes,
  FocusableProps,
  PressEvents,
} from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { createMemo, mergeProps, splitProps } from 'solid-js'

import { createFocusable } from '@saftox-ui/focus'
import { createPress } from '@saftox-ui/interactions'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { filterDOMProps } from '@saftox-ui/utils'

export interface AriaLinkProps extends AriaLabelingProps, PressEvents, FocusableProps {
  /**
   *  Whether the link is disabled.
   */
  isDisabled?: boolean

  /**
   * The HTML element used to render the link, e.g. 'a', or 'span'.
   * @default 'a'
   */
  elementType?: string

  /**
   * Handler that is called when the click is released over the target.
   */
  onClick?: (e: MouseEvent) => void
}

export interface LinkAria<T extends HTMLElement> {
  /**
   * Whether the link is currently pressed.
   */
  isPressed: Accessor<boolean>

  /**
   * Props for the link element.
   */
  linkProps: DOMAttributes<T>
}

/**
 * Provides the behavior and accessibility implementation for a link component.
 * A link allows a user to navigate to another page or resource within a web page
 * or application.
 */
export function createLink<T extends HTMLElement = HTMLAnchorElement>(
  originalProps: AriaLinkProps,
  ref: Accessor<T | undefined>,
): LinkAria<T> {
  const defaultProps: AriaLinkProps = {
    elementType: 'a',
  }

  const props = mergeProps(originalProps, defaultProps)

  const [local, createPressProps, others] = splitProps(
    props,
    ['elementType', 'onClick', 'isDisabled'],
    ['onPress', 'onPressStart', 'onPressEnd', 'isDisabled'],
  )

  const { focusableProps } = createFocusable(props, ref)

  const { pressProps, isPressed } = createPress(createPressProps, ref)

  const domProps = mergeProps(createMemo(() => filterDOMProps(others, { labelable: true })))

  const isAnchorTag = () => local.elementType === 'a'

  const baseLinkProps: DOMAttributes<T> = {
    get role() {
      return isAnchorTag() ? 'link' : undefined
    },
    get tabIndex() {
      return isAnchorTag() && !local.isDisabled ? 0 : undefined
    },
    get 'aria-disabled'() {
      return local.isDisabled
    },
    onClick: (e) => {
      if (!props.onClick) {
        return
      }

      props.onClick(e)
    },
  }

  return {
    isPressed,
    linkProps: combineProps(domProps, focusableProps, pressProps, baseLinkProps),
  }
}
