import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { Component, JSX } from 'solid-js'

import { useNavbarContext } from './navbar-context'

import { splitProps } from 'solid-js'

import { clsx } from '@saftox-ui/shared-utils'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface NavbarContentProps extends HTMLSaftoxUIProps<'ul'> {
  ref?: Ref<HTMLUListElement>
  /**
   * The justify of the content
   * @default start
   */
  justify?: 'start' | 'end' | 'center'
}

const NavbarContent: Component<NavbarContentProps> = (props) => {
  const [local, rest] = splitProps(props, ['ref', 'as', 'class', 'children', 'justify'])

  const Component = local.as || 'ul'

  const { slots, local: localContext } = useNavbarContext()

  return (
    <Dynamic
      as={Component}
      ref={local.ref}
      class={slots().content?.({ class: clsx(localContext.classes?.content, local.class) })}
      data-justify={local.justify}
      {...rest}
    >
      {props.children}
    </Dynamic>
  )
}

export default NavbarContent
