import type { RadioProps } from './radio-types'
import type { Component } from 'solid-js'

import { useRadio } from './use-radio'

import { Show } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { createVisuallyHidden } from '@saftox-ui/visually-hidden'

const Radio: Component<RadioProps> = (props) => {
  const {
    Component,
    children,
    slots,
    local,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props)

  const { visuallyHiddenProps } = createVisuallyHidden()

  return (
    <Dynamic as={Component} {...getBaseProps()}>
      <span {...visuallyHiddenProps}>
        <input {...getInputProps()} />
      </span>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        <Show when={'children' in props}>
          <span {...getLabelProps()}>{props.children}</span>
        </Show>
        <Show when={local.description}>
          <span class={slots().description({ class: local.classes?.description })}>
            {props.description}
          </span>
        </Show>
      </div>
    </Dynamic>
  )
}

export default Radio
