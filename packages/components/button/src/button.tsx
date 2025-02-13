import type { UseButtonProps } from './button-types'
import type { Component } from 'solid-js'

import { GlowEffect } from './glow-effect'
import { useButton } from './use-button'

import { Show } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface ButtonProps extends UseButtonProps {}

const Button: Component<ButtonProps> = (props) => {
  const {
    Component,
    properties,
    startContent,
    endContent,
    slots,
    spinner,
    getButtonProps,
    getGlowEffectProps,
  } = useButton(props)

  return (
    <Dynamic as={Component} {...getButtonProps()}>
      <Show when={props.variant === 'glow' && !properties.isLoading && !properties.isDisabled}>
        <GlowEffect {...getGlowEffectProps} />
      </Show>

      <div class={slots().innerWrapper()}>
        <Show when={startContent}>{startContent}</Show>

        <Show when={properties.isLoading && properties.spinnerPlacement === 'start'}>
          {spinner()}
        </Show>

        <Show when={properties.isLoading && properties.isIconOnly} fallback={props.children}>
          {null}
        </Show>

        <Show when={properties.isLoading && properties.spinnerPlacement === 'end'}>
          {spinner()}
        </Show>

        <Show when={endContent}>{endContent}</Show>
      </div>
    </Dynamic>
  )
}

export default Button
