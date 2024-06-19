import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { CreateToggleStateProps } from '@saftox-ui/toggle'
import type { JSX } from 'solid-js'

import type { ButtonGroupVariantProps, ButtonVariantProps } from '@saftox-ui/theme'
import type {
  AriaLabelingProps,
  ElementType,
  FocusableDOMProps,
  FocusableProps,
  PressEvents,
} from '@saftox-ui/types'

interface ButtonProps extends PressEvents, FocusableProps {
  /**
   * Whether the button is disabled.
   */
  isDisabled?: boolean

  /**
   * The content to display in the button.
   */
  children?: JSX.Element
}

export interface AriaButtonElementTypeProps<T extends ElementType = 'button'> {
  /**
   * The HTML element or SolidJS component used to render the button, e.g. 'div', 'a', or `Link`.
   * @default 'button'
   */
  elementType?: T
}

export interface LinkButtonProps<T extends ElementType = 'button'>
  extends AriaButtonElementTypeProps<T> {
  /**
   * A URL to link to if elementType="a".
   */
  href?: string

  /**
   * The target window for the link.
   */
  target?: string

  /**
   * The relationship between the linked resource and the current page.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel).
   */
  rel?: string
}

interface AriaBaseButtonProps extends FocusableDOMProps, AriaLabelingProps {
  /**
   * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
   */
  'aria-expanded'?: boolean

  /**
   * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
   */
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  'aria-controls'?: string

  /**
   * Indicates the current "pressed" state of toggle buttons. */
  'aria-pressed'?: boolean

  /**
   * The behavior of the button when used in an HTML form.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'

  /**
   * Whether the button should not receive focus on press.
   */
  preventFocusOnPress?: boolean

  /**
   * Whether the button can receive focus when disabled.
   */
  allowFocusWhenDisabled?: boolean

  /**
   * Handler that is called when the click is released over the target.
   */
  onClick?: (e: MouseEvent) => void
}

export interface AriaButtonProps<T extends ElementType = 'button'>
  extends ButtonProps,
    LinkButtonProps<T>,
    AriaBaseButtonProps {}

export interface AriaToggleButtonProps<T extends ElementType = 'button'>
  extends CreateToggleStateProps,
    ButtonProps,
    AriaBaseButtonProps,
    AriaButtonElementTypeProps<T> {}

// --------------------

interface Props extends HTMLSaftoxUIProps<'button'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The button start content.
   */
  startContent?: JSX.Element
  /**
   * The button end content.
   */
  endContent?: JSX.Element
  /**
   * Spinner to display when loading.
   */
  spinner?: JSX.Element
  /**
   * The spinner placement.
   * @default "start"
   */
  spinnerPlacement?: 'start' | 'end'
  /**
   * Whether the button should display a loading spinner.
   * @default false
   */
  isLoading?: boolean
  /**
   * The native button click event handler.
   * use `onPress` instead.
   */
  onClick?: JSX.EventHandler<HTMLElement, MouseEvent>
}

export type UseButtonProps = Props &
  Omit<AriaButtonProps, keyof ButtonVariantProps> &
  Omit<ButtonVariantProps, 'isInGroup'>

// ButtonGroupProps,

interface ButtonGroupProps extends HTMLSaftoxUIProps, ButtonGroupVariantProps {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * Whether the buttons are disabled.
   * @default false
   */
  isDisabled?: UseButtonProps['isDisabled']
}

export type ContextType = {
  size?: UseButtonProps['size']
  color?: UseButtonProps['color']
  variant?: UseButtonProps['variant']
  radius?: UseButtonProps['radius']
  isDisabled?: UseButtonProps['isDisabled']
  disableAnimation?: UseButtonProps['disableAnimation']
  isIconOnly?: UseButtonProps['isIconOnly']
  fullWidth?: boolean
}

export type UseButtonGroupProps = ButtonGroupProps &
  Partial<
    Pick<
      UseButtonProps,
      'size' | 'color' | 'radius' | 'variant' | 'isIconOnly' | 'disableAnimation' | 'fullWidth'
    >
  >
