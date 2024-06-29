import type { Meta, StoryObj } from '@saftox-ui/storybook-solid'
import type { NavbarProps } from '../src'

import { createSignal, For } from 'solid-js'

import { navbar } from '@saftox-ui/theme'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '../src'

import { Link } from '@saftox-ui/link'
import { Button } from '@saftox-ui/Button'

import { LoremIpsum } from 'lorem-ipsum'

export default {
  title: 'Components/Navbar',
  component: Navbar,
  argTypes: {
    position: {
      control: {
        type: 'select',
      },
      options: ['static', 'fixed'],
    },
    maxWidth: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
    },
    isBlurred: {
      control: {
        type: 'boolean',
      },
    },
  },
  decorators: [
    (Story) => (
      <div class="flex justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Navbar>

const defaultProps = {
  ...navbar.defaultVariants,
}

const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36" aria-hidden="true">
    <path
      clip-rule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
)

const App = (props: any) => {
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  })

  return (
    <div
      ref={props.ref}
      class="max-w-[90%] sm:max-w-[80%] max-h-[90vh] overflow-x-hidden overflow-y-scroll shadow-md relative border border-default"
    >
      {props.children}
      <div class="max-w-5xl flex flex-col gap-4 px-10 mt-8 text-foreground">
        <h1>Lorem ipsum dolor sit ame</h1>
        <For each={[1, 2, 3, 4, 5, 6, 7]}>
          {() => {
            return <p class="mb-5 text-lg">{lorem.generateSentences(20)}</p>
          }}
        </For>
      </div>
    </div>
  )
}

const Template = (args: NavbarProps) => {
  // for hide on scroll cases
  const [parentRef, setParentRef] = createSignal<HTMLElement>()

  return (
    <App ref={setParentRef}>
      <Navbar {...args} parentRef={parentRef()}>
        <NavbarBrand>
          <AcmeLogo />
          <p class="font-bold hidden sm:block text-inherit">ACME</p>
        </NavbarBrand>
        <NavbarContent class="hidden md:flex">
          <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#">Customers</Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Pricing
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Company
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link href="#">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </App>
  )
}

export const Static = {
  render: Template,

  args: {
    ...defaultProps,
    position: 'static',
  },
}

export const Sticky = {
  render: Template,

  args: {
    ...defaultProps,
    position: 'sticky',
  },
}

export const HideOnScroll = {
  render: Template,

  args: {
    ...defaultProps,
    position: 'sticky',
    shouldHideOnScroll: true,
  },
}
