import type { RadioGroupProps } from './radio-types'
import type { Component } from 'solid-js'

import { createRadioGroupContext } from './radio-group-context'
import { useRadioGroup } from './use-radio-group'

import { Match, Show, Switch } from 'solid-js'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { omitProps } from '@saftox-ui/solid-utils/reactivity'

const RadioGroup: Component<RadioGroupProps> = (props) => {
  const {
    Component,
    context,
    properties,
    getGroupProps,
    getLabelProps,
    getWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
  } = useRadioGroup(props)

  const RadioGroupContext = createRadioGroupContext()

  return (
    <Dynamic as={Component} {...getGroupProps()}>
      <Show when={'label' in props}>
        <span {...getLabelProps()}>{props.label}</span>
      </Show>

      <div {...getWrapperProps()}>
        <RadioGroupContext.Provider value={context}>{props.children}</RadioGroupContext.Provider>
      </div>

      <Switch>
        <Match when={properties.isInvalid && properties.errorMessage}>
          <div {...getErrorMessageProps()}>{properties.errorMessage}</div>
        </Match>

        <Match when={'description' in props}>
          <div {...getDescriptionProps()}>{props.description}</div>
        </Match>
      </Switch>
    </Dynamic>
  )
}

export default RadioGroup
