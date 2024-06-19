import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps, PropGetter } from '@saftox-ui/system-ssc'
import type { DividerVariantProps } from '@saftox-ui/theme'

import { createSeparator, type SeparatorProps as AriaSeparatorProps } from './create-separator'

import { mergeProps, splitProps } from 'solid-js'

import { divider } from '@saftox-ui/theme'

interface Props extends HTMLSaftoxUIProps<'hr'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLElement>
}

export type UseDividerProps = Props & DividerVariantProps & Omit<AriaSeparatorProps, 'elementType'>

export function useDivider(originalProps: UseDividerProps) {
  const [local, rest] = splitProps(originalProps, ['ref', 'as', 'class', 'orientation'])

  let Component = local.as || 'hr'

  if (Component === 'hr' && local.orientation === 'vertical') {
    Component = 'div'
  }

  const { separatorProps } = createSeparator({
    elementType: typeof Component === 'string' ? Component : 'hr',
    orientation: local.orientation,
  })

  const styles = () =>
    divider({
      get orientation() {
        return local.orientation
      },
      get class() {
        return local.class
      },
    })

  const getDividerProps: PropGetter = (props = {}) =>
    mergeProps(
      {
        class: styles(),
        role: 'separator',
        get 'data-orientation'() {
          return local.orientation
        },
      },
      separatorProps,
      rest,
      props,
    )

  return { Component, getDividerProps }
}

export type UseDividerReturn = ReturnType<typeof useDivider>
