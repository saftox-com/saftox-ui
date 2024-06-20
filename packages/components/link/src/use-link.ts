import type { UseLinkProps } from './link-types'
import type { PropGetter } from '@saftox-ui/system'

import { createSignal, mergeProps, splitProps } from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { dataAttr } from '@saftox-ui/shared-utils'
import { mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { link } from '@saftox-ui/theme'

import { createLink } from './aria/create-link'

export function useLink(originalProps: UseLinkProps) {
  const globalContext = useProviderContext()

  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, link.variantKeys)

  const defaultProps = {
    isExternal: false,
    showAnchorIcon: false,
    autofocus: false,
  }

  const props = mergeProps(defaultProps, omitVariantProps)

  const [local, createPressProps, rest] = splitProps(
    props,
    ['ref', 'as', 'anchorIcon', 'isExternal', 'showAnchorIcon', 'autofocus', 'class'],
    ['onPress', 'onPressStart', 'onPressEnd', 'onClick'],
  )

  const Component = local.as || 'a'
  const [domRef, setDomRef] = createSignal<HTMLElement>()

  const disableAnimation = () =>
    originalProps?.disableAnimation ?? globalContext?.disableAnimation ?? false

  const { linkProps } = createLink(
    mergeProps(rest, createPressProps, {
      get isDisabled() {
        return originalProps?.isDisabled
      },
      elementType: `${Component}`,
    }),
    domRef,
  )

  const { isFocused, isFocusVisible, focusProps } = createFocusRing({
    autofocus: local.autofocus,
  })

  const classes = () =>
    link(
      mergeProps(variantProps, {
        get disableAnimation() {
          return disableAnimation()
        },
        get class() {
          return local.class
        },
      }),
    )

  const getLinkProps: PropGetter = () =>
    mergeProps(
      {
        ref: mergeRefs(local.ref, setDomRef),
        get class() {
          return classes()
        },
        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get 'data-disabled'() {
          return dataAttr(originalProps.isDisabled)
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },
        get rel() {
          return local.isExternal ? 'noopener noreferrer' : undefined
        },
        get target() {
          return local.isExternal ? '_blank' : undefined
        },
      },
      rest,
      linkProps,
      focusProps,
    )

  return {
    Component,
    local,
    getLinkProps,
  }
}

export type UseLinkReturn = ReturnType<typeof useLink>
