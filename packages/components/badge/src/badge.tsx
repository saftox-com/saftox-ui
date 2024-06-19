import type { Component } from 'solid-js'

import { Show } from 'solid-js'
import type { UseBadgeProps } from './use-badge'
import { useBadge } from './use-badge'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface BadgeProps extends UseBadgeProps {}

const Badge: Component<BadgeProps> = (props) => {
  const { Component, local, slots, getBadgeProps } = useBadge(props)

  return (
    <div class={slots().base({ class: props.classes?.base })}>
      {props.children}
      <Dynamic as={Component} {...getBadgeProps()}>
        <Show when={local.content}>{local.content}</Show>
      </Dynamic>
    </div>
  )
}

export default Badge
