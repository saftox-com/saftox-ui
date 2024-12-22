import type { SwitchProps } from './switch-types'
import type { Component } from 'solid-js'

import { useSwitch } from './use-switch'

import { Show } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { createVisuallyHidden } from '@saftox-ui/visually-hidden'

const Switch: Component<SwitchProps> = (props) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getWrapperProps,
    getThumbProps,
    getThumbIconProps,
    getLabelProps,
    getStartContentProps,
    getEndContentProps,
  } = useSwitch(props)

  const { visuallyHiddenProps } = createVisuallyHidden()

  const clonedThumbIcon = () => {
    if (typeof props.thumbIcon === 'function') {
      return props.thumbIcon(
        getThumbIconProps({
          includeStateProps: true,
        }),
      )
    }

    return undefined
  }

  const clonedStartContent = () => {
    if (typeof props?.startContent === 'function') {
      return props.startContent(getStartContentProps())
    }

    return undefined
  }

  const clonedEndContent = () => {
    if (typeof props?.endContent === 'function') {
      return props?.endContent(getEndContentProps())
    }

    return undefined
  }

  return (
    <Dynamic<SwitchProps> as={Component} {...getBaseProps()}>
      <span {...visuallyHiddenProps}>
        <input {...getInputProps()} />
      </span>

      <span {...getWrapperProps()}>
        <Show when={'startContent' in props}>{clonedStartContent()}</Show>

        <span {...getThumbProps()}>
          <Show when={'thumbIcon' in props}>{clonedThumbIcon()}</Show>
        </span>

        <Show when={'endContent' in props}>{clonedEndContent()}</Show>
      </span>

      <Show when={'children' in props}>
        <span {...getLabelProps()}>{children()}</span>
      </Show>
    </Dynamic>
  )
}

export default Switch
