import type { Component } from 'solid-js'
import type { UseButtonGroupProps } from './button-types'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { omitProps } from '@saftox-ui/solid-utils/reactivity'
import { Show, createEffect } from 'solid-js'
import { createButtonGroupContext } from './button-group-context'
import { GlowEffect } from './glow-effect'
import { useButtonGroup } from './use-button-group'

export interface ButtonGroupProps extends UseButtonGroupProps {}

const ButtonGroup: Component<ButtonGroupProps> = (originalProps) => {
  const ButtonGroupContext = createButtonGroupContext()
  const omitedProps = omitProps(originalProps, ['children'])

  const { Component, slots, context, getButtonGroupProps, getGlowEffectProps } =
    useButtonGroup(omitedProps)

  return (
    <ButtonGroupContext.Provider value={context}>
      <Dynamic as={Component} class={slots().base()} {...getButtonGroupProps}>
        <Show when={context.variant === 'glow'}>
          <GlowEffect {...getGlowEffectProps} />
        </Show>
        <div class={slots().innerWrapper()}>{originalProps.children}</div>
      </Dynamic>
    </ButtonGroupContext.Provider>
  )
}

export default ButtonGroup
