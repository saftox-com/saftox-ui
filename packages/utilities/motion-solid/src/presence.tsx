import type { Options } from './types'
import type { Accessor, FlowComponent, JSX } from 'solid-js'

import { mountedStates } from '@motionone/dom'
import { createSwitchTransition } from '@solid-primitives/transition-group'

import { onCompleteExit } from './primitives'

import { batch, createContext, createSignal } from 'solid-js'

import { resolveFirst } from '@saftox-ui/solid-utils/reactivity'

export type PresenceContextState = {
  initial: boolean
  mount: Accessor<boolean>
}

export const PresenceContext = createContext<PresenceContextState>()

/**
 * Perform exit/enter trantisions of children `<Motion>` components.
 *
 * accepts props:
 * - `initial` – *(Defaults to `true`)* – If `false`, will disable the first animation on all child `Motion` elements the first time `Presence` is rendered.
 * - `exitBeforeEnter` – *(Defaults to `false`)* – If `true`, `Presence` will wait for the exiting element to finish animating out before animating in the next one.
 *
 * @example
 * ```tsx
 * <Presence exitBeforeEnter>
 *   <Show when={toggle()}>
 *     <Motion.div
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     />
 *   </Show>
 * </Presence>
 * ```
 */
export const Presence: FlowComponent<
  {
    initial?: boolean
    exitBeforeEnter?: boolean
    children: (ref: (el: Element) => Element) => JSX.Element
  },
  (ref: (el: Element) => Element, children: Accessor<JSX.Element>) => JSX.Element
> = (props) => {
  const [mount, setMount] = createSignal(true)

  const state = { initial: props.initial ?? true, mount }
  const [motionRef, setMotionRef] = createSignal<Element | any>()

  const render = (
    <PresenceContext.Provider value={state}>
      {
        createSwitchTransition(
          resolveFirst(() => props.children(setMotionRef)),
          {
            appear: state.initial,
            mode: props.exitBeforeEnter ? 'out-in' : 'parallel',
            onExit(el, done) {
              batch(() => {
                setMount(false)
                ;(mountedStates.get(motionRef())?.getOptions() as Options)?.exit
                  ? onCompleteExit(motionRef(), done)
                  : done()
              })
            },
            onEnter(_, done) {
              batch(() => {
                setMount(true)
                done()
              })
            },
          },
        ) as any as JSX.Element
      }
    </PresenceContext.Provider>
  )

  state.initial = true

  return render
}
