import type { Component } from 'solid-js'
import type { AvatarProps } from './avatar-types'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { Match, Show, Switch } from 'solid-js'
import { useAvatar } from './use-avatar'

const Avatar: Component<AvatarProps> = (props) => {
  const { Component, properties, local, slots, getInitials, getAvatarProps, getImageProps } =
    useAvatar(props)

  return (
    <Dynamic as={Component} {...getAvatarProps()}>
      <Show when={local.src}>
        <Dynamic as={local.ImgComponent} {...getImageProps()} alt={local.alt} />
      </Show>

      {/* Fallback */}
      <Switch
        fallback={
          <Show
            when={local.name}
            fallback={
              <span
                aria-label={local.alt}
                class={slots().icon({ class: props.classes?.icon })}
                role="img"
              >
                {local.icon}
              </span>
            }
          >
            <span
              aria-label={local.alt}
              class={slots().name({ class: props.classes?.name })}
              role="img"
            >
              {getInitials(local.name)}
            </span>
          </Show>
        }
      >
        <Match when={!properties.showFlallback && local.src}>{null}</Match>
        <Match when={props.fallback}>
          <div aria-label={local.alt} class={slots().fallback({ class: props.classes?.fallback })}>
            {props.fallback}
          </div>
        </Match>
      </Switch>
    </Dynamic>
  )
}

export default Avatar
