import type { UseNavbarReturn } from './use-navbar'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { NavbarSlots, NavbarVariantProps, SlotsToClasses } from '@saftox-ui/theme'

interface Props extends HTMLSaftoxUIProps<'nav'> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref
  /**
   * The parent element where the navbar is placed within.
   * This is used to determine the scroll position and whether the navbar should be hidden or not.
   * @default `window`
   */
  parentRef?: HTMLElement
  /**
   * The height of the navbar.
   * @default "4rem" (64px)
   */
  height?: number | string
  /**
   * Whether the menu is open.
   * @default false
   */
  isMenuOpen?: boolean
  /**
   * Whether the menu should be open by default.
   * @default false
   */
  isMenuDefaultOpen?: boolean
  /**
   * Whether the navbar should hide on scroll or not.
   * @default false
   */
  shouldHideOnScroll?: boolean
  /**
   * Whether the navbar parent scroll event should be listened to or not.
   * @default false
   */
  disableScrollHandler?: boolean
  /**
   * The props to modify the framer motion animation. Use the `variants` API to create your own animation.
   * This motion is only available if the `shouldHideOnScroll` prop is set to `true`.
   */
  // motionProps?: HTMLMotionProps<"nav">;
  /**
   * The event handler for the menu open state.
   * @param isOpen boolean
   * @returns void
   */
  onMenuOpenChange?: (isOpen: boolean) => void
  /**
   * The scroll event handler for the navbar. The event fires when the navbar parent element is scrolled.
   * it only works if `disableScrollHandler` is set to `false` or `shouldHideOnScroll` is set to `true`.
   */
  onScrollPositionChange?: (scrollPosition: number) => void
  /**
   * class or List of classes to change the classes of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Navbar classes={{
   *    base:"base-classes",
   *    wrapper: "wrapper-classes",
   *    brand: "brand-classes",
   *    content: "content-classes",
   *    item: "item-classes",
   *    menu: "menu-classes", // the one that appears when the menu is open
   *    menuItem: "menu-item-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<NavbarSlots>
}

export type UseNavbarProps = Props & NavbarVariantProps
export interface NavbarProps extends UseNavbarProps {}
