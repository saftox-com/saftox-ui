import type { IconSvgProps } from '../types'

export const CheckLinearIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    role="presentation"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={2}
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
