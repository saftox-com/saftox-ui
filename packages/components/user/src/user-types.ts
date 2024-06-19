import type { AvatarProps } from '@saftox-ui/avatar'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { SlotsToClasses, UserSlots } from '@saftox-ui/theme'
import type { JSX } from 'solid-js'

interface Props {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The user name.
   */
  name: JSX.Element | string
  /**
   * The user information, like email, phone, etc.
   */
  description?: JSX.Element | string
  /**
   * Whether the user can be focused.
   * @default false
   */
  isFocusable?: boolean
  /**
   * The user avatar props
   */
  avatarProps?: Partial<AvatarProps>
  /**
   * class or List of classes to change the classes of the avatar.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <User classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    name: "name-classes",
   *    description: "description-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<UserSlots>
}

export type UseUserProps = Props & Omit<HTMLSaftoxUIProps<'div'>, 'children'>
export interface UserProps extends UseUserProps {}
