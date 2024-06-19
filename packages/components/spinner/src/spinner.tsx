import type { Component } from 'solid-js'
import type { UseSpinnerProps } from './spinner-types'

import { Show } from 'solid-js'
import { useSpinner } from './use-spinner'

export interface SpinnerProps extends UseSpinnerProps {}

const Spinner: Component<SpinnerProps> = (props) => {
  const { slots, label, getSpinnerProps } = useSpinner(props)

  return (
    <div {...getSpinnerProps}>
      <div class={slots().wrapper({ class: props.classes?.wrapper })}>
        <i class={slots().circle1({ class: props.classes?.circle1 })} />
        <i class={slots().circle2({ class: props.classes?.circle2 })} />
      </div>
      <Show when={label()}>
        <span class={slots().label({ class: props.classes?.label })}>{label()}</span>
      </Show>
    </div>
  )
}

export default Spinner
