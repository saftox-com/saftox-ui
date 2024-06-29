import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { Component } from 'solid-js'

import { useNavbarContext } from './navbar-context'

import { splitProps } from 'solid-js'

import { clsx } from '@saftox-ui/shared-utils'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface NavbarBrandProps extends HTMLSaftoxUIProps<'div'> {
  ref?: Ref<HTMLUListElement>
}

const NavbarBrand: Component<NavbarBrandProps> = (props) => {
  const [local, rest] = splitProps(props, ['ref', 'as', 'class', 'children'])

  const Component = local.as || 'ul'

  const { slots, local: localContext } = useNavbarContext()

  return (
    <Dynamic
      as={Component}
      ref={local.ref}
      class={slots().brand?.({ class: clsx(localContext.classes?.content, local.class) })}
      {...rest}
    >
      {props.children}
    </Dynamic>
  )
}

export default NavbarBrand
