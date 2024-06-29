import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { Component, JSX } from 'solid-js'

import { useNavbarContext } from './navbar-context'

import { splitProps } from 'solid-js'

import { clsx } from '@saftox-ui/shared-utils'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface NavbarItemProps extends HTMLSaftoxUIProps<'li'> {
  ref?: Ref<HTMLLIElement>
  /**
   * Whether the item is active or not.
   * @default false
   */
  isActive?: boolean
}

const NavbarItem: Component<NavbarItemProps> = (props) => {
  const [local, rest] = splitProps(props, ['ref', 'as', 'class', 'isActive'])

  const Component = local.as || 'ul'

  const { slots, local: localContext } = useNavbarContext()

  return (
    <Dynamic
      as={Component}
      ref={local.ref}
      class={slots().content?.({ class: clsx(localContext.classes?.content, local.class) })}
      {...rest}
    >
      {props.children}
    </Dynamic>
  )
}

export default NavbarItem
