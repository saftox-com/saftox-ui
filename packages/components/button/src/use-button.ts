import type { AriaButtonProps, UseButtonProps } from './button-types'
import type { GlowEffectProps } from './glow-effect'
import type { SpinnerProps } from '@saftox-ui/spinner'
import type { PropGetter } from '@saftox-ui/system'
import type { JSX } from 'solid-js'

import { useButtonGroupContext } from './button-group-context'

import { children, createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { createHover } from '@saftox-ui/interactions'
import { clsx, dataAttr } from '@saftox-ui/shared-utils'
import { chain, combineProps, mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { Spinner } from '@saftox-ui/spinner'
import { button } from '@saftox-ui/theme'
import { filterDOMProps } from '@saftox-ui/utils'

import { createButton } from './aria/create-button'

export function useButton<T extends HTMLButtonElement>(originalProps: UseButtonProps) {
  const groupContext = useButtonGroupContext()

  const defaultProps: UseButtonProps = {
    variant: 'glow',
    color: 'default',
    size: 'md',
    spinnerPlacement: 'start',
    disableAnimation: false,
    fullWidth: false,
    isDisabled: false,
    isIconOnly: false,
    isLoading: false,
  }

  const spinner = () => Spinner({ color: 'current', size: spinnerSize() })

  const props = mergeProps(defaultProps, groupContext, originalProps)

  const [local, variantProps, rest] = splitProps(
    props,
    [
      'ref',
      'as',
      'children',
      'startContent',
      'endContent',
      'autofocus',
      'class',
      'spinner',
      'isDisabled',
      'isLoading',
      'spinnerPlacement',
      'onClick',
    ],
    ['size', 'color', 'variant', 'radius', 'fullWidth', 'disableAnimation', 'isIconOnly'],
  )

  const [domRef, setDomRef] = createSignal<HTMLElement | undefined>()

  const Component = local.as || 'button'
  const shouldFilterDOMProps = typeof Component === 'string'

  const { isFocusVisible, isFocused, focusProps } = createFocusRing({
    autofocus: local.autofocus,
    isTextInput: false,
  })

  const properties = {
    get isDisabled() {
      return local.isDisabled || local.isLoading
    },
    get isLoading() {
      return local.isLoading
    },
    get isIconOnly() {
      return variantProps.isIconOnly
    },
    get spinnerPlacement() {
      return local.spinnerPlacement
    },
  }

  const slots = createMemo(() =>
    button(
      combineProps(variantProps, {
        get isInGroup() {
          return Boolean(groupContext)
        },
        get isDisabled() {
          return properties.isDisabled
        },
      }),
    ),
  )

  const handleClick: JSX.EventHandlerUnion<T, MouseEvent> = () => {
    if (properties.isDisabled || variantProps.disableAnimation) return
  }

  const { buttonProps, isPressed } = createButton(
    combineProps(
      {
        elementType: Component,
        isDisabled: properties.isDisabled,
        onClick: chain([handleClick, local.onClick]),
      },
      rest,
    ) as AriaButtonProps,
    domRef,
  )

  const { isHovered, hoverProps } = createHover({
    isDisabled: properties.isDisabled,
  })

  const getButtonProps: PropGetter<HTMLButtonElement> = (props = {}) => {
    const buttonLolcaProps = {
      ref: mergeRefs(local.ref, setDomRef),
      get class() {
        return slots().base({
          class: clsx(props.class, local.class),
        })
      },
      get 'data-disabled'() {
        return dataAttr(properties.isDisabled)
      },
      get 'data-focus'() {
        return dataAttr(isFocused)
      },
      get 'data-pressed'() {
        return dataAttr(isPressed)
      },
      get 'data-focus-visible'() {
        return dataAttr(isFocusVisible)
      },
      get 'data-hover'() {
        return dataAttr(isHovered)
      },
      get 'data-loading'() {
        return dataAttr(properties.isLoading)
      },
    }

    const mergeButtonProps = mergeProps(
      buttonProps,
      focusProps,
      hoverProps,
      shouldFilterDOMProps && filterDOMProps(rest),
      filterDOMProps(props),
    )

    return combineProps(mergeButtonProps, buttonLolcaProps)
  }

  const getGlowEffectProps: GlowEffectProps = {
    ref: domRef,
    get radius() {
      return variantProps.radius
    },
    get color() {
      return variantProps.color
    },
  }

  const getIconClone = (icon: JSX.Element) => {
    const i = children(() => icon)
    // TODO: add some aria props
    return i()
  }

  const startContent = getIconClone(local.startContent)
  const endContent = getIconClone(local.endContent)

  const spinnerSize = () => {
    const buttonSpinnerSizeMap: Record<string, SpinnerProps['size']> = {
      sm: 'sm',
      md: 'sm',
      lg: 'md',
    }

    return buttonSpinnerSizeMap[variantProps.size as keyof typeof buttonSpinnerSizeMap]
  }

  return {
    Component,
    properties,
    startContent,
    endContent,
    domRef,
    slots,
    spinner,
    getButtonProps,
    getGlowEffectProps,
  }
}

export type UseButtonReturn = ReturnType<typeof useButton>
