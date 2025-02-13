import type { Meta } from '@saftox-ui/storybook-solid'
import type { VariantProps } from '@saftox-ui/theme'

import { link } from '@saftox-ui/theme'
import { tv } from '@saftox-ui/variants'

import { Link, type LinkProps } from '../src'

export default {
  title: 'Components/Link',
  component: Link,
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: ['foreground', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
    },
    underline: {
      control: {
        type: 'select',
      },
      options: ['none', 'hover', 'always', 'active', 'focus'],
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  decorators: [
    (Story: any) => (
      <div class="flex items-center justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Link>

const children = `"lorem ipsum dolor sit amet" - Serhii Zaitsev`

const defaultProps = {
  ...link.defaultVariants,
  isDisabled: false,
  showAnchorIcon: true,
  children,
}

const Template = (args: LinkProps) => <Link {...args} href="#" />

export const Default = {
  render: Template,

  args: {
    ...defaultProps,
    isDisabled: false,
    color: 'foreground',
    size: 'md',
  },
}

export const Underline = Template.bind({}) as any
Underline.args = {
  ...defaultProps,
  underline: 'always',
  isDisabled: false,
  size: 'md',
}

const CustomLink = () => (
  <svg
    class="custom-link-icon ml-1"
    fill="none"
    height="1em"
    shape-rendering="geometricPrecision"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="1em"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

export const isExternal = Template.bind({}) as any
isExternal.args = {
  ...defaultProps,
  isExternal: true,
}

export const CustomAnchor = Template.bind({}) as any
CustomAnchor.args = {
  ...defaultProps,
  anchorIcon: <CustomLink />,
}

export const isBlock = Template.bind({}) as any

isBlock.args = {
  ...defaultProps,
  isBlock: true,
  isDisabled: false,
  size: 'md',
  color: 'secondary',
}

const customLink = tv({
  variants: {
    color: {
      teal: 'text-teal-600',
    },
    isLink: {
      true: "before:content-['👉'] before:mr-1",
    },
  },
})

type MyLinkVariantProps = VariantProps<typeof customLink>

type MyLinkProps = MyLinkVariantProps & Omit<LinkProps, 'color'>

const MyLink = (props: MyLinkProps) => {
  const { isLink, color, ...otherProps } = props

  return <Link class={customLink({ color, isLink })} isExternal={!!isLink} {...otherProps} />
}

export const CustomVariant = () => {
  return (
    <MyLink isLink color="teal" href="#">
      Visit out new Store
    </MyLink>
  )
}
