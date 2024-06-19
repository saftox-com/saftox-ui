import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps, PropGetter } from '@saftox-ui/system'
import type { SkeletonSlots, SkeletonVariantProps, SlotsToClasses } from '@saftox-ui/theme'

import { createMemo, mergeProps, splitProps } from 'solid-js'

import { clsx, dataAttr } from '@saftox-ui/shared-utils'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { skeleton } from '@saftox-ui/theme'

interface Props extends HTMLSaftoxUIProps<'div'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The skeleton will be visible while isLoading is `false`.
   * @default false
   */
  isLoaded?: boolean
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Skeleton classes={{
   *    base:"base-classes", // skeleton wrapper
   *    content: "content-classes", // children wrapper
   * }} />
   * ```
   */
  classes?: SlotsToClasses<SkeletonSlots>
}

export type UseSkeletonProps = Props & SkeletonVariantProps

export function useSkeleton(originalProps: UseSkeletonProps) {
  const globalContext = useProviderContext()

  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, skeleton.variantKeys)

  const defaultProps: UseSkeletonProps = {
    isLoaded: false,
  }

  const props = mergeProps(defaultProps, omitVariantProps)

  const [local, rest] = splitProps(props, ['ref', 'as', 'isLoaded', 'class', 'classes'])

  const Component = local.as || 'div'

  const properties = {
    get disableAnimation() {
      return originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false
    },
  }

  const slots = createMemo(() =>
    skeleton({
      get disableAnimation() {
        return properties.disableAnimation
      },
    }),
  )

  const getSkeletonProps: PropGetter = (props = {}) => {
    return mergeProps(
      {
        get 'data-loaded'() {
          return dataAttr(local.isLoaded)
        },
        get class() {
          return slots().base({
            class: clsx(clsx(local.classes?.base, local.class), props?.class),
          })
        },
      },
      rest,
    )
  }

  const getContentProps: PropGetter = (props = {}) => {
    return {
      get class() {
        return slots().content({
          class: clsx(local.classes?.content, props?.class),
        })
      },
    }
  }

  return {
    Component,
    slots,
    getSkeletonProps,
    getContentProps,
  }
}

export type UseSkeletonReturn = ReturnType<typeof useSkeleton>
