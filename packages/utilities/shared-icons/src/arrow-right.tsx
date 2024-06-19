import { mergeProps, splitProps } from 'solid-js'
import type { IconSvgProps } from './types'

export const ArrowRightIcon = (_props: IconSvgProps) => {
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
        d="M16.835 6.91821L23.9166 13.9999L16.835 21.0815"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miter-limit="10"
        stroke-width={props['stroke-width']}
      />
      <path
        d="M4.08325 14H23.7183"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miter-limit="10"
        stroke-width={props['stroke-width']}
      />
    </svg>
  )
}
