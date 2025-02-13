import type { ConfigurableWindow } from '@saftox-ui/shared-hooks'
import type { MaybeAccessor } from '@saftox-ui/shared-hooks/utils'

import { createSignal, onMount } from 'solid-js'
import { createMutable } from 'solid-js/store'

import { defaultWindow, writableComputed } from '@saftox-ui/shared-hooks'
import { toValue } from '@saftox-ui/shared-hooks/to-value'
import { useDebounceFn } from '@saftox-ui/shared-hooks/use-debounce-fn'
import { useThrottleFn } from '@saftox-ui/shared-hooks/use-throttle-fn'
import { useEventListener } from '@saftox-ui/use-event-listener'

export interface UseScrollOptions extends ConfigurableWindow {
  /**
   * Throttle time for scroll event, it’s disabled by default.
   *
   * @default 0
   */
  throttle?: number

  /**
   * The check time when scrolling ends.
   * This configuration will be setting to (throttle + idle) when the `throttle` is configured.
   *
   * @default 200
   */
  idle?: number

  /**
   * Offset arrived states by x pixels
   *
   */
  offset?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }

  /**
   * Trigger it when scrolling.
   *
   */
  onScroll?: (e: Event) => void

  /**
   * Trigger it when scrolling ends.
   *
   */
  onStop?: (e: Event) => void

  /**
   * Listener options for scroll event.
   *
   * @default {capture: false, passive: true}
   */
  eventListenerOptions?: boolean | AddEventListenerOptions

  /**
   * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
   * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` Signals.
   *
   * @default 'auto'
   */
  behavior?: MaybeAccessor<ScrollBehavior>
}

/**
 * We have to check if the scroll amount is close enough to some threshold in order to
 * more accurately calculate arrivedState. This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

/**
 * Reactive scroll.
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useScroll
 */
export function useScroll(
  element?: MaybeAccessor<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollOptions = {},
) {
  const {
    throttle = 0,
    idle = 200,
    onStop = () => {},
    onScroll = () => {},
    offset = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    eventListenerOptions = {
      capture: false,
      passive: true,
    },
    behavior = 'auto',
    window = defaultWindow,
  } = options

  const [internalX, setInternalX] = createSignal(0)
  const [internalY, setInternalY] = createSignal(0)

  // Use a computed for x and y because we want to write the value to the Signals
  // during a `scrollTo()` without firing additional `scrollTo()`s in the process.
  const [x, setX] = writableComputed({
    get() {
      return internalX()
    },
    set(x) {
      scrollTo(x, undefined)
    },
  })
  const [y, setY] = writableComputed({
    get() {
      return internalY()
    },
    set(y) {
      scrollTo(undefined, y)
    },
  })

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    if (!window) return

    const _element = toValue(element)

    if (!_element) return
    ;(_element instanceof Document ? window.document.body : _element)?.scrollTo({
      top: toValue(_y) ?? y(),
      left: toValue(_x) ?? x(),
      behavior: toValue(behavior),
    })
  }

  const [isScrolling, setIsScrolling] = createSignal(false)
  const arrivedState = createMutable({
    left: true,
    right: false,
    top: true,
    bottom: false,
  })
  const directions = createMutable({
    left: false,
    right: false,
    top: false,
    bottom: false,
  })

  const onScrollEnd = (e: Event) => {
    if (!isScrolling()) return
    setIsScrolling(false)
    directions.left = false
    directions.right = false
    directions.top = false
    directions.bottom = false
    onStop(e)
  }
  const onScrollEndDebounced = useDebounceFn(onScrollEnd, throttle + idle)

  const setArrivedState = (
    target: HTMLElement | SVGElement | Window | Document | null | undefined,
  ) => {
    if (!window) return

    let el = target as HTMLElement | null

    if (target === window || target === window.document) {
      el = window.document.body
    }

    if (!el) return

    const { scrollLeft, scrollTop } = el
    const { display, flexDirection } = getComputedStyle(el)

    directions.left = scrollLeft < internalX()
    directions.right = scrollLeft > internalX()
    const left = Math.abs(scrollLeft) <= 0 + (offset.left ?? 0)
    const right =
      Math.abs(scrollLeft) + el.clientWidth >=
      el.scrollWidth - (offset.right ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    if (display === 'flex' && flexDirection === 'row-reverse') {
      arrivedState.left = right
      arrivedState.right = left
    } else {
      arrivedState.left = left
      arrivedState.right = right
    }
    setInternalX(scrollLeft)

    // patch for mobile compatible

    directions.top = scrollTop < internalY()
    directions.bottom = scrollTop > internalY()
    const top = Math.abs(scrollTop) <= 0 + (offset.top ?? 0)
    const bottom =
      Math.abs(scrollTop) + el.clientHeight >=
      el.scrollHeight - (offset.bottom ?? 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    /**
     * reverse columns and rows behave exactly the other way around,
     * bottom is treated as top and top is treated as the negative version of bottom
     */
    if (display === 'flex' && flexDirection === 'column-reverse') {
      arrivedState.top = bottom
      arrivedState.bottom = top
    } else {
      arrivedState.top = top
      arrivedState.bottom = bottom
    }

    setInternalY(scrollTop)
  }

  const onScrollHandler = (e: Event) => {
    if (!window) return

    setArrivedState(e.target as HTMLElement)
    setIsScrolling(true)
    onScrollEndDebounced(e)
    onScroll(e)
  }

  onMount(() => {
    useEventListener(
      element ?? window,
      'scroll',
      throttle ? useThrottleFn(onScrollHandler, throttle, true, false) : onScrollHandler,
      eventListenerOptions,
    )

    useEventListener(element ?? window, 'scrollend', onScrollEnd, eventListenerOptions)
  })

  return {
    x,
    setX,
    y,
    setY,
    isScrolling,
    arrivedState,
    directions,
    measure() {
      const _element = toValue(element)

      if (window && _element) setArrivedState(_element)
    },
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
