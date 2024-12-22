import type { UseCheckboxReturn } from './use-checkbox'

import { splitProps } from 'solid-js'

import { access } from '@saftox-ui/solid-utils/reactivity'

type CheckboxIconProps = Partial<ReturnType<UseCheckboxReturn['getIconProps']>>

function CheckIcon(props: CheckboxIconProps) {
  const [local, other] = splitProps(props, ['isSelected', 'disableAnimation'])

  return (
    <svg aria-hidden="true" role="presentation" viewBox="0 0 17 18" {...other}>
      <polyline
        fill="none"
        points="1 9 7 14 15 4"
        stroke="currentColor"
        stroke-dasharray="22"
        stroke-dashoffset={access(local.isSelected) ? 44 : 66}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        style={
          !local.disableAnimation && access(local.isSelected)
            ? {
                transition: 'stroke-dashoffset 250ms linear 0.2s',
              }
            : {}
        }
      />
    </svg>
  )
}

function IndeterminateIcon(props: CheckboxIconProps) {
  const [local, rest] = splitProps(props, ['isSelected', 'disableAnimation'])

  return (
    <svg stroke="currentColor" stroke-width={3} view-box="0 0 24 24" aria-hidden="true" {...rest}>
      <line x1="21" x2="3" y1="12" y2="12" />
    </svg>
  )
}

/**
 * CheckboxIcon is used to visually indicate the checked or indeterminate
 * state of a checkbox.
 */
export function CheckboxIcon(props: CheckboxIconProps) {
  const [local, rest] = splitProps(props, ['isIndeterminate'])

  const BaseIcon = local.isIndeterminate ? IndeterminateIcon : CheckIcon

  return <BaseIcon {...rest} />
}
