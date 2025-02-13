import type { MotionComponentProps, MotionProxy, MotionProxyComponent } from './types'
import type { MotionState } from '@motionone/dom'
import type { JSX } from 'solid-js'

import { PresenceContext } from './presence'
import { createAndBindMotionState } from './primitives'

import { createContext, splitProps, useContext } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import { combineStyle } from '@saftox-ui/solid-utils/reactivity'

const OPTION_KEYS = [
  'initial',
  'animate',
  'inView',
  'inViewOptions',
  'hover',
  'press',
  'variants',
  'transition',
  'exit',
] as const

const ATTR_KEYS = ['tag'] as const

export const ParentContext = createContext<MotionState>()

/** @internal */
export const MotionComponent = (
  props: MotionComponentProps & {
    tag?: string
    ref?: any
    style?: JSX.CSSProperties | string
  },
) => {
  const [options, , attrs] = splitProps(props, OPTION_KEYS, ATTR_KEYS)

  const [state, style] = createAndBindMotionState(
    () => root,
    () => ({ ...options }),
    useContext(PresenceContext),
    useContext(ParentContext),
  )

  let root!: Element

  return (
    <ParentContext.Provider value={state}>
      <Dynamic
        {...attrs}
        ref={(el: Element) => {
          root = el
          props.ref?.(el)
        }}
        component={props.tag || 'div'}
        style={combineStyle(props.style, style)}
      />
    </ParentContext.Provider>
  )
}

/**
 * Renders an animatable HTML or SVG element.
 *
 * @component
 * Animation props:
 * - `animate` a target of values to animate to. Accepts all the same values and keyframes as Motion One's [animate function](https://motion.dev/dom/animate). This prop is **reactive** – changing it will animate the transition element to the new state.
 * - `transition` for changing type of animation
 * - `initial` a target of values to animate from when the element is first rendered.
 * - `exit` a target of values to animate to when the element is removed. The element must be a direct child of the `<Presence>` component.
 *
 * @example
 * ```tsx
 * <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}/>
 * ```
 *
 * Interaction animation props:
 *
 * - `inView` animation target for when the element is in view
 * - `hover` animate when hovered
 * - `press` animate when pressed
 *
 * @example
 * ```tsx
 * <Motion.div hover={{ scale: 1.2 }} press={{ scale: 0.9 }}/>
 * ```
 */
export const Motion = new Proxy(MotionComponent, {
  get:
    (_, tag: string): MotionProxyComponent<any> =>
    (props) => <MotionComponent {...props} tag={tag} />,
}) as MotionProxy
