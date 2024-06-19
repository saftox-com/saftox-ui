import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { LinkVariantProps } from '@saftox-ui/theme'
import type { JSX } from 'solid-js'
import type { AriaLinkProps } from './create-link'

interface Props extends HTMLSaftoxUIProps<'a'>, LinkVariantProps {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLAnchorElement>
  /**
   * Whether the link is external.
   * @default false
   */
  isExternal?: boolean
  /**
   * Whether to show the icon when the link is external.
   * @default false
   */
  showAnchorIcon?: boolean
  /**
   * The icon to display right after the link.
   * @default <LinkIcon />
   */
  anchorIcon?: JSX.Element
}

export type UseLinkProps = Props & AriaLinkProps
export interface LinkProps extends UseLinkProps {}
