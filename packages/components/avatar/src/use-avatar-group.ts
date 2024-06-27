import type { UseAvatarGroupProps } from './avatar-group-types'
import type { AvatarProps } from './avatar-types'
import type { PropGetter } from '@saftox-ui/system'
import type { JSX } from 'solid-js'

import { children, createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

import { clsx } from '@saftox-ui/shared-utils'
import { isBrowserElement, isElement } from '@saftox-ui/solid-utils'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { avatarGroup } from '@saftox-ui/theme'

const getValidChildren = (c: JSX.Element) => {
  const resolver = children(() => c)

  return resolver.toArray().filter((child: JSX.Element) => isElement(child)) as JSX.Element[]
}

export function useAvatarGroup(originalProps: UseAvatarGroupProps = {}) {
  const defaultProps = {
    max: 5,
  }

  const props = mergeProps(originalProps, defaultProps)

  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'max',
    'total',
    'size',
    'children',
    'color',
    'radius',
    'isBordered',
    'isDisabled',
    'isGrid',
    'renderCount',
    'class',
    'classes',
  ])

  const [context, _] = splitProps(props, [
    'size',
    'color',
    'radius',
    'isGrid',
    'isBordered',
    'isDisabled',
  ])

  const Component = local.as || 'div'
  const [domRef, setDomRef] = createSignal<HTMLDivElement>()
  const [remainingCount, setRemainingCount] = createSignal<number>()

  const slots = createMemo(() =>
    avatarGroup({
      get class() {
        return local.class
      },
      get isGrid() {
        return context.isGrid
      },
    }),
  )

  const clones = (children: JSX.Element) => {
    const validChildren = () => getValidChildren(children)

    const childrenWithinMax = () =>
      local.max ? validChildren().slice(0, local.max) : validChildren()

    const countChildren = (local.children as [])?.length
    const remainingCount = local.total
      ? local.total
      : local.max != null
        ? countChildren - local.max
        : -1

    setRemainingCount(remainingCount)

    return childrenWithinMax().map((child, index) => {
      const isFirstAvatar = index === 0
      const isLastAvatar = index === countChildren - 1

      const childClass = clsx(
        isFirstAvatar ? 'mr-0' : !local.isGrid ? '-mr-2' : '',
        isLastAvatar && remainingCount < 1 ? 'hover:-translate-x-0' : '',
      )

      if (isBrowserElement(child) && childClass.length > 0) {
        ;(child as HTMLElement).classList.add(childClass)
      }

      return child
    })
  }
  const getAvatarGroupProps: PropGetter = () => {
    return combineProps(
      {
        ref: mergeProps(local.ref, setDomRef),
        get class() {
          return slots().base({
            class: clsx(local.classes?.base, local.class),
          })
        },
        role: 'group',
      },
      rest,
    )
  }

  const getAvatarGroupCountProps = () => {
    return {
      get class() {
        return slots().count({
          class: local.classes?.count,
        })
      },
    } as AvatarProps
  }

  return {
    Component,
    context,
    domRef,
    clones,
    remainingCount,
    getAvatarGroupProps,
    getAvatarGroupCountProps,
  }
}

export type UseAvatarReturn = ReturnType<typeof useAvatarGroup>
