import type { UseNavbarProps } from './navbar-types'
import type { PropGetter } from '@saftox-ui/system'

import { createResizeObserver } from '@solid-primitives/resize-observer'

import { createEffect, createSignal, mergeProps, on, splitProps } from 'solid-js'

import { clsx, dataAttr } from '@saftox-ui/shared-utils'
import { combineProps, mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { navbar } from '@saftox-ui/theme'
import { useScroll } from '@saftox-ui/use-scroll'
import { createControllableSignal } from '@saftox-ui/utils'

export function useNavbar(originalProps: UseNavbarProps) {
  const globalContext = useProviderContext()

  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, navbar.variantKeys)

  const defaultProps = {
    height: '4rem',
    isMenuOpen: false,
    isMenuDefaultOpen: false,
    shouldHideOnScroll: false,
    disableScrollHandler: false,
    onMenuOpenChange: () => {},
    onScrollPositionChange: () => {},
  }

  const propsWithDefaults = mergeProps(defaultProps, omitVariantProps)

  const [local, rest] = splitProps(propsWithDefaults, [
    'as',
    'ref',
    'parentRef',
    'height',
    'shouldHideOnScroll',
    'disableScrollHandler',
    'onScrollPositionChange',
    'isMenuOpen',
    'isMenuDefaultOpen',
    'onMenuOpenChange',
    'class',
    'classes',
  ])

  const Component = local.as || 'div'
  const disableAnimation = () =>
    originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false
  const baseStyles = () => clsx(local.classes?.base, local.class)

  const [domRef, setDomRef] = createSignal<HTMLElement | undefined>(undefined)

  const [isHidden, setIsHidden] = createSignal(false)
  const [prevWidth, setPrevWidth] = createSignal(0)
  const [navHeight, setNavHeight] = createSignal(0)

  //
  const handleMenuOpenChange = (isOpen: boolean | undefined) => {
    local.onMenuOpenChange(isOpen || false)
  }

  const [isMenuOpen, setIsMenuOpen] = createControllableSignal<boolean | undefined>({
    value: () => local.isMenuOpen,
    defaultValue: () => local.isMenuDefaultOpen,
    onChange: handleMenuOpenChange,
  })

  const updateWidth = () => {
    if (domRef()) {
      const width = () => domRef()?.offsetWidth || 0

      if (width() !== prevWidth()) {
        setPrevWidth(width())
      }
    }
  }

  createResizeObserver(domRef(), () => {
    const currentWidth = () => domRef()?.offsetWidth

    if (currentWidth() !== prevWidth()) {
      updateWidth()
      setIsMenuOpen(false)
    }
  })

  createEffect(() => {
    updateWidth()
    setNavHeight(domRef()?.offsetHeight || 0)
  })

  const slots = () =>
    navbar(
      mergeProps(variantProps, {
        get disableAnimation() {
          return disableAnimation()
        },
        get hideOnScroll() {
          return local.shouldHideOnScroll
        },
      }),
    )

  const { y, directions, arrivedState, isScrolling } = useScroll(local.parentRef, {
    offset: { top: 30, bottom: 30, right: 30, left: 30 },
  })

  createEffect(
    on([isScrolling], () => {
      if (directions.bottom && !arrivedState.top && !arrivedState.bottom) {
        setIsHidden(true)
      } else if (directions.top || arrivedState.bottom) {
        setIsHidden(false)
      }

      if ('onScrollPositionChange' in local) {
        local.onScrollPositionChange(y())
      }
    }),
  )

  const getBaseProps: PropGetter = (props = {}) =>
    mergeProps(
      combineProps(rest, props),
      {
        ref: mergeRefs(local.ref, setDomRef),
        get 'data-hidden'() {
          return dataAttr(isHidden())
        },
        get 'data-menu-open'() {
          return dataAttr(isMenuOpen())
        },
        get class() {
          return slots().base({ class: clsx(baseStyles(), props?.class) })
        },
      },
      {
        style: {
          '--navbar-height': local.height,
          // ...otherProps?.style,
          // ...props?.style,
        },
      },
    )

  const getWrapperProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      get 'data-menu-open'() {
        return dataAttr(isMenuOpen())
      },
      get class() {
        return slots().wrapper({ class: clsx(local.classes?.wrapper) })
      },
    })

  return {
    Component,
    slots,
    local,
    domRef,
    isHidden,
    disableAnimation,
    isMenuOpen,
    setIsMenuOpen,
    getBaseProps,
    getWrapperProps,
  }
}

export type UseNavbarReturn = ReturnType<typeof useNavbar>
