import type { SwitchThumbIconProps, UseSwitchProps } from './switch-types'
import type { PropGetter } from '@saftox-ui/system'

import { createSwitch } from './create-switch'

import {
  children as resolveChildren,
  createMemo,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
} from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { createHover } from '@saftox-ui/interactions'
import { createPress } from '@saftox-ui/interactions'
import { chain, clsx, dataAttr } from '@saftox-ui/shared-utils'
import { mergeRefs, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { toggle } from '@saftox-ui/theme'

export function useSwitch(originalProps: UseSwitchProps) {
  const globalContext = useProviderContext()
  const children = resolveChildren(() => originalProps.children)

  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, toggle.variantKeys)

  const defaultProps: UseSwitchProps = {
    value: '',
    isReadOnly: false,
    autofocus: false,
  }

  const props = mergeProps(defaultProps, omitVariantProps)

  const [local, rest] = splitProps(props, [
    'ref',
    'as',
    'name',
    'value',
    'isReadOnly',
    'autofocus',
    'startContent',
    'endContent',
    'defaultSelected',
    'isSelected',
    'thumbIcon',
    'class',
    'classes',
    'onChange',
    'onValueChange',
  ])

  const Component = local.as || 'label'

  const [domRef, setDomRef] = createSignal<HTMLLabelElement | undefined>()
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>()

  const labelId = createUniqueId()

  const pickLoclPropsForAriaSwitch = pickProps(local, [
    'name',
    'value',
    'autofocus',
    'defaultSelected',
    'isSelected',
    'isReadOnly',
  ])

  const ariaSwitchProps = mergeProps(pickLoclPropsForAriaSwitch, {
    get ariaLabel() {
      return rest['aria-label'] || typeof children() === 'string'
        ? (children() as string)
        : undefined
    },
    get isDisabled() {
      return variantProps.isDisabled
    },
    get 'aria-label'() {
      return this.ariaLabel
    },
    'aria-labelledby': rest['aria-labelledby'] || labelId,
    onChange: local.onValueChange,
  })

  const { inputProps, isPressed: isPressedSwitch, state } = createSwitch(ariaSwitchProps, inputRef)

  const { focusProps, isFocused, isFocusVisible } = createFocusRing({
    get autofocus() {
      return inputProps.autofocus
    },
  })

  const { hoverProps, isHovered } = createHover({
    get isDisabled() {
      return inputProps.disabled
    },
  })

  const [isPressed, setPressed] = createSignal(false)
  const { pressProps } = createPress({
    get isDisabled() {
      return properties.isInteractionDisabled
    },
    onPressStart(e) {
      if (e.pointerType !== 'keyboard') {
        setPressed(true)
      }
    },
    onPressEnd(e) {
      if (e.pointerType !== 'keyboard') {
        setPressed(false)
      }
    },
  })

  const properties = {
    get disableAnimation() {
      return originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false
    },
    get isInteractionDisabled() {
      return ariaSwitchProps.isDisabled || ariaSwitchProps.isReadOnly
    },
    get isPressed() {
      return this.isInteractionDisabled ? false : isPressed() || isPressedSwitch()
    },
    get isSelected() {
      return inputProps.checked
    },
    get isDisabled() {
      return inputProps.disabled
    },
  }

  const slots = createMemo(() =>
    toggle(
      mergeProps(variantProps, {
        get disableAnimation() {
          return properties.disableAnimation
        },
      }),
    ),
  )

  const getBaseProps: PropGetter = (props) => {
    return mergeProps(hoverProps, pressProps, rest, props, {
      ref: setDomRef,
      get class() {
        return slots().base({
          class: clsx(clsx(local.classes?.base, local.class), props?.class),
        })
      },
      get 'data-disabled'() {
        return dataAttr(properties.isDisabled)
      },
      get 'data-selected'() {
        return dataAttr(properties.isSelected)
      },
      get 'data-readonly'() {
        return dataAttr(local.isReadOnly)
      },
      get 'data-focus'() {
        return dataAttr(isFocused)
      },
      get 'data-focus-visible'() {
        return dataAttr(isFocusVisible)
      },
      get 'data-hover'() {
        return dataAttr(isHovered)
      },
      get 'data-pressed'() {
        return dataAttr(properties.isPressed)
      },
    })
  }

  const getWrapperProps: PropGetter = (props = {}) => {
    return mergeProps(props, {
      'aria-hidden': true,
      get class() {
        return slots().wrapper({
          class: clsx(local.classes?.wrapper, props?.class),
        })
      },
    })
  }

  const getInputProps: PropGetter = (props = {}) => {
    return mergeProps(inputProps, focusProps, props, {
      ref: mergeRefs(local.ref, setInputRef),
      id: inputProps.id,
      onChange: chain(inputProps.onChange, local.onChange),
    })
  }

  const getThumbProps: PropGetter = (props = {}) => {
    return mergeProps(props, {
      get class() {
        return slots().thumb({
          class: clsx(local.classes?.thumb, props?.class),
        })
      },
    })
  }

  const getLabelProps: PropGetter = (props = {}) => {
    return mergeProps(props, {
      id: labelId,
      get class() {
        return slots().label({
          class: clsx(local.classes?.label, props?.class),
        })
      },
    })
  }

  const getThumbIconProps = (
    props: Partial<SwitchThumbIconProps> & { includeStateProps?: boolean } = {
      includeStateProps: false,
    },
  ) => {
    return mergeProps(
      {
        width: '1em',
        height: '1em',
        get class() {
          return slots().thumbIcon({
            class: clsx(local.classes?.thumbIcon, props?.class),
          })
        },
      },
      props.includeStateProps && {
        get isSelected() {
          return state.isSelected()
        },
      },
    ) as unknown as SwitchThumbIconProps
  }

  const getStartContentProps: PropGetter = (props = {}) => {
    return mergeProps(
      {
        width: '1em',
        height: '1em',
      },
      props,
      {
        get class() {
          return slots().startContent({
            class: clsx(local.classes?.startContent, props?.class),
          })
        },
      },
    )
  }

  const getEndContentProps: PropGetter = (props = {}) => {
    return mergeProps(
      {
        width: '1em',
        height: '1em',
      },
      props,
      {
        get class() {
          return slots().endContent({
            class: clsx(local.classes?.endContent, local.class),
          })
        },
      },
    )
  }

  return {
    Component,
    local,
    properties,
    slots,
    domRef,
    children,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getThumbProps,
    getThumbIconProps,
    getStartContentProps,
    getEndContentProps,
  }
}

export type UseSwitchReturn = ReturnType<typeof useSwitch>
