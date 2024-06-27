import type { CheckboxProps } from './checkbox-types'

import { CheckboxIcon } from './checkbox-icon'
import { useCheckbox } from './use-checkbox'

import { type Component, Show } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { createVisuallyHidden } from '@saftox-ui/visually-hidden'

const Checkbox: Component<CheckboxProps> = (props) => {
  const {
    Component,
    children,
    icon = CheckboxIcon,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getIconProps,
    getLabelProps,
  } = useCheckbox(props)

  const { visuallyHiddenProps } = createVisuallyHidden()

  const clonedIcon = () => {
    if (typeof icon === 'function') {
      return icon(getIconProps())
    }

    return icon
  }

  return (
    <>
      <Dynamic as={Component} {...getBaseProps()}>
        <span {...visuallyHiddenProps}>
          <input {...getInputProps()} />
        </span>
        <span {...getWrapperProps()}>{clonedIcon()}</span>
        <Show when={'children' in props}>
          <span {...getLabelProps}>{children()}</span>
        </Show>
      </Dynamic>
    </>
  )
}

export default Checkbox
