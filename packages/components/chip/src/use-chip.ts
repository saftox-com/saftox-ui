import type {
  ContentProps,
  ContentPropsFn,
  ContentValidComponent,
  GetAvatarCloneProps,
  GetContentCloneProps,
  UseChipProps,
} from './chip-types'
import type { PropGetter } from '@saftox-ui/system'

import {
  children as resolveChildren,
  createMemo,
  createSignal,
  type FlowComponent,
  mergeProps,
  splitProps,
} from 'solid-js'
import { spread } from 'solid-js/web'

import { createFocusRing } from '@saftox-ui/focus'
import { createPress } from '@saftox-ui/interactions'
import { clsx } from '@saftox-ui/shared-utils'
import { mapPropsVariants } from '@saftox-ui/system'
import { chip } from '@saftox-ui/theme'

export function useChip(originalProps: UseChipProps) {
  const children = resolveChildren(() => originalProps.children)

  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, chip.variantKeys)

  const [local, rest] = splitProps(omitVariantProps, [
    'ref',
    'as',
    'class',
    'classes',
    'avatar',
    'startContent',
    'endContent',
    'onClose',
  ])

  const Component = local.as || 'div'
  const [domRef, setDomRef] = createSignal<HTMLElement>()

  const { focusProps: closeFocusProps, isFocusVisible: isCloseButtonFocusVisible } =
    createFocusRing()

  const { pressProps: closePressProps } = createPress({
    get isDisabled() {
      return Boolean(omitVariantProps?.isDisabled)
    },
    onPress: local.onClose,
  })

  const properties = {
    get baseStyles() {
      return clsx(local.classes?.base, local.class)
    },
    get isCloseable() {
      return Boolean(local.onClose)
    },
    get isDotVariant() {
      return variantProps.variant === 'dot'
    },
    get isOneChar() {
      return typeof children() === 'string' && children()?.toString().length === 1
    },
    get hasStartContent() {
      return Boolean(local.avatar || local.startContent)
    },
    get hasEndContent() {
      return Boolean(local.endContent || local.onClose)
    },
  }

  const slots = createMemo(() =>
    chip(mergeProps(variantProps, properties, isCloseButtonFocusVisible)),
  )

  const getChipProps: PropGetter = () => {
    return mergeProps(
      {
        ref: mergeProps(local.ref, setDomRef),
        get class() {
          return slots().base({
            class: properties.baseStyles,
          })
        },
      },
      rest,
    )
  }

  const getCloseButtonProps: PropGetter = () => {
    return mergeProps(
      {
        role: 'button',
        tabIndex: 0,
        get class() {
          return slots().closeButton({
            class: local.classes?.closeButton,
          })
        },
      },
      closePressProps,
      closeFocusProps,
    )
  }

  const getAvatarClone: GetAvatarCloneProps = (avatar) => {
    if (typeof avatar === 'function') {
      return avatar({
        get class() {
          return slots().avatar({
            class: local.classes?.avatar,
          })
        },
      })
    }

    return avatar
  }

  const getContentClone: GetContentCloneProps = (content) => {
    const resolveContent = resolveChildren(() => content as Element)
    const resolved = resolveContent() as Element

    if (typeof content === 'function') {
      const isProxyFunction = resolved.toString().includes('function () { [native code] }')

      if (isProxyFunction) {
        return content({
          class: 'max-h-[80%]',
        })
      }

      if (typeof resolved === 'function') {
        return content((props) => ({
          class: clsx('max-h-[80%]', props?.class),
        }))
      }

      if (typeof resolved === 'object') {
        const isSVG = resolved?.tagName === 'svg'
        spread(resolved, { class: 'max-h-[80%]' }, isSVG)

        return resolved
      }
    }

    if (typeof content === 'object') {
      spread(resolved, {
        get class() {
          return clsx('max-h-[80%]', resolved?.className)
        },
      })

      return resolved
    }

    return resolved
  }

  return {
    Component,
    children,
    local,
    domRef,
    properties,
    slots,
    get startContent() {
      return getAvatarClone(local.avatar) || getContentClone(local.startContent)
    },
    get endContent() {
      return getContentClone(local.endContent)
    },
    getChipProps,
    getCloseButtonProps,
  }
}

export type UseChipReturn = ReturnType<typeof useChip>
