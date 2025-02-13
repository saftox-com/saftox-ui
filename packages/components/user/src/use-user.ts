import type { UseUserProps } from './user-types'
import type { PropGetter } from '@saftox-ui/system'

import { createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { clsx, dataAttr } from '@saftox-ui/shared-utils'
import { mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { user } from '@saftox-ui/theme'
import { filterDOMProps } from '@saftox-ui/utils'

export function useUser(originalProps: UseUserProps) {
  const defaultProps = {
    isFocusable: false,
    avatarProps: {},
  }

  const props = mergeProps(defaultProps, originalProps)
  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'name',
    'description',
    'class',
    'classes',
    'isFocusable',
    'avatarProps',
  ])

  const avatarProps = mergeProps(
    {
      isFocusable: false,
      name: typeof local.name === 'string' ? local.name : undefined,
    },
    local.avatarProps,
  )

  const Component = local.as || 'div'
  const shouldFilterDOMProps = typeof Component === 'string'

  const [domRef, setDomRef] = createSignal<HTMLElement | null>(null)

  const { isFocusVisible, isFocused, focusProps } = createFocusRing({})

  const slots = createMemo(() => user())

  const canBeFocused = () => local.isFocusable || local.as === 'button'
  const baseStyles = () => clsx(local.classes?.base, local.class)

  const getUserProps: PropGetter = () => {
    return mergeProps(
      {
        ref: mergeRefs(local.ref, setDomRef),
        get tabIndex() {
          return isFocusVisible() ? 0 : -1
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },
        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get class() {
          return slots().base({
            class: baseStyles(),
          })
        },
      },
      filterDOMProps(rest, {
        enabled: shouldFilterDOMProps,
      }),
      canBeFocused() && focusProps,
    )
  }

  return {
    Component,
    slots,
    baseStyles,
    avatarProps,
    getUserProps,
  }
}
