import type { Component } from 'solid-js'
import type { KbdProps } from './kbd-types'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { For, Show } from 'solid-js'
import { useKbd } from './use-kbd'
import { kbdKeysLabelMap, kbdKeysMap } from './utils'

const Kbd: Component<KbdProps> = (props) => {
  const { Component, slots, keysToRender, getKbdProps } = useKbd(props)

  return (
    <Dynamic as={Component} {...getKbdProps()}>
      <For each={keysToRender()}>
        {(key) => (
          <abbr class={slots().abbr({ class: props.classes?.abbr })} title={kbdKeysLabelMap[key]}>
            {kbdKeysMap[key]}
          </abbr>
        )}
      </For>
      <Show when={props.children}>
        <span class={slots().content({ class: props.classes?.content })}>{props.children}</span>
      </Show>
    </Dynamic>
  )
}

export default Kbd
