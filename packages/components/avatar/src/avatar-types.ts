import type { JSX } from 'solid-js'

import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'

import type { AvatarSlots, AvatarVariantProps, SlotsToClasses } from '@saftox-ui/theme'

interface Props extends HTMLSaftoxUIProps<'span'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<HTMLSpanElement>
  /**
   * Ref to the Image DOM node.
   */
  imgRef?: Ref<HTMLImageElement>
  /**
   * The name of the person in the avatar. -
   * if **src** has loaded, the name will be used as the **alt** attribute of the **img**
   * - If **src** is not loaded, the name will be used to create the initials
   */
  name?: string
  /**
   * Image source.
   */
  src?: string
  /**
   * Image alt text.
   */
  alt?: string
  /*
   * Avatar icon.
   */
  icon?: JSX.Element
  /**
   * Whether the avatar can be focused.
   * @default false
   */
  isFocusable?: boolean
  /**
   * If `true`, the fallback logic will be skipped.
   * @default false
   */
  ignoreFallback?: boolean
  /**
   * If `false`, the avatar will show the background color while loading.
   */
  showFallback?: boolean
  /**
   * Function to get the initials to display
   */
  getInitials?: (name: string) => string
  /**
   * Custom fallback component.
   */
  fallback?: JSX.Element
  /**
   * Function called when image failed to load
   */
  onError?: () => void
  /**
   * The component used to render the image.
   * @default "img"
   */
  ImgComponent?: keyof JSX.IntrinsicElements
  /**
   * Props to pass to the image component.
   */
  imgProps?: JSX.ImgHTMLAttributes<HTMLImageElement>
  /**
   * class or List of classes to change the classes of the avatar.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Avatar classes={{
   *    base:"base-classes",
   *    img: "image-classes",
   *    name: "name-classes",
   *    icon: "icon-classes",
   *    fallback: "fallback-classes"
   * }} />
   * ```
   */
  classes?: SlotsToClasses<AvatarSlots>
}

export type UseAvatarProps = Props &
  Omit<AvatarVariantProps, 'children' | 'isInGroup' | 'isInGridGroup'>

export interface AvatarProps extends UseAvatarProps {}

export type ContextType = {
  size?: AvatarProps['size']
  color?: AvatarProps['color']
  radius?: AvatarProps['radius']
  isBordered?: AvatarProps['isBordered']
  isDisabled?: AvatarProps['isDisabled']
  isGrid?: boolean
}
