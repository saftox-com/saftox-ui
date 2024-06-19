import type { IconSvgProps } from './types'

import { mergeProps, splitProps } from 'solid-js'

export const ChevronDownIcon = (_props: IconSvgProps) => {
  const [props, otherProps] = splitProps(mergeProps({ 'stroke-width': 1.5 }, _props), [
    'stroke-width',
  ])

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miter-limit={10}
        stroke-width={props['stroke-width']}
      />
    </svg>
  )
}
