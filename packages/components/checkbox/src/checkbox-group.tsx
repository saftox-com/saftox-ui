import type { CheckboxGroupProps } from './checkbox-types'

import { createCheckboxGroupContext } from './checkbox-group-context'
import { CheckboxIcon } from './checkbox-icon'
import { useCheckboxGroup } from './use-checkbox-group'

import { type Component, Show } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { createVisuallyHidden } from '@saftox-ui/visually-hidden'

const CheckboxGroup: Component<CheckboxGroupProps> = (props) => {
  const {
    Component,
    context,
    properties,
    getGroupProps,
    getLabelProps,
    getWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
  } = useCheckboxGroup(props)

  const { visuallyHiddenProps } = createVisuallyHidden()
  const CheckboxGroupContext = createCheckboxGroupContext()

  return (
    <Dynamic as={Component} {...getGroupProps()}>
      <Show when={'label' in props}>
        <span {...getLabelProps()}>{props.label}</span>
      </Show>
      <div {...getWrapperProps()}>
        <CheckboxGroupContext.Provider value={context}>
          {props.children}
        </CheckboxGroupContext.Provider>
      </div>

      {properties.isInvalid && properties.errorMessage ? (
        <div {...getErrorMessageProps()}>{properties.errorMessage}</div>
      ) : props.description ? (
        <div {...getDescriptionProps()}>{props.description}</div>
      ) : null}
    </Dynamic>
  )
}

export default CheckboxGroup
