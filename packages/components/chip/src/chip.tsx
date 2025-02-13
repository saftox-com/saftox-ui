import type { ChipProps } from './chip-types'
import type { Component } from 'solid-js'

import { useChip } from './use-chip'

import { Show } from 'solid-js'

import { CloseFilledIcon } from '@saftox-ui/shared-icons'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

const Chip: Component<ChipProps> = (props) => {
  const {
    Component,
    children,
    local,
    properties,
    slots,
    startContent,
    endContent,
    getCloseButtonProps,
    getChipProps,
  } = useChip(props)

  return (
    <Dynamic<ChipProps> as={Component} {...getChipProps()}>
      <Show when={properties.isDotVariant && !startContent} fallback={startContent}>
        <span
          class={slots().dot({
            class: local.classes?.dot,
          })}
        />
      </Show>

      <span
        class={slots().content({
          class: local.classes?.content,
        })}
      >
        {children()}
      </span>

      <Show when={properties.isCloseable} fallback={endContent}>
        <span {...getCloseButtonProps()}>{endContent || <CloseFilledIcon />}</span>
      </Show>
    </Dynamic>
  )
}

export default Chip
