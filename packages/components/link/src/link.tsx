import type { LinkProps } from './link-types'
import type { Component } from 'solid-js'

import { useLink } from './use-link'

import { Show } from 'solid-js'

import { LinkIcon } from '@saftox-ui/shared-icons'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { linkAnchorClasses } from '@saftox-ui/theme'

const Link: Component<LinkProps> = (props) => {
  const { Component, local, getLinkProps } = useLink(props)

  return (
    <Dynamic as={Component} {...getLinkProps()}>
      {props.children}
      <Show when={local.showAnchorIcon}>
        <Show when={props.anchorIcon} fallback={<LinkIcon class={linkAnchorClasses} />}>
          {props.anchorIcon}
        </Show>
      </Show>
    </Dynamic>
  )
}

export default Link
