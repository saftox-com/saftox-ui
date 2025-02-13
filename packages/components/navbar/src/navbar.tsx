import type { NavbarProps } from './navbar-types'
import type { Component } from 'solid-js'

import { createNavbarContext } from './navbar-context'
import { useNavbar } from './use-navbar'

import { Show } from 'solid-js'

import { Motion } from '@saftox-ui/motion-solid'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { omitProps } from '@saftox-ui/solid-utils/reactivity'

const Navbar: Component<NavbarProps> = (props) => {
  const propsWithoutChildren = omitProps(props, ['children'])

  const context = useNavbar(propsWithoutChildren)

  const NavbarContext = createNavbarContext()

  const content = () => {
    return <header {...context.getWrapperProps()}>{props.children}</header>
  }

  return (
    <NavbarContext.Provider value={context}>
      <Show
        when={context.local.shouldHideOnScroll}
        fallback={
          <Dynamic as={context.Component} {...context.getBaseProps()}>
            {content()}
          </Dynamic>
        }
      >
        <Motion.nav
          animate={context.isHidden() ? { y: '-5em' } : { y: 0 }}
          {...context.getBaseProps({
            class: '!flex-col divide-y',
          })}
        >
          {content()}
        </Motion.nav>
      </Show>
    </NavbarContext.Provider>
  )
}

export default Navbar
