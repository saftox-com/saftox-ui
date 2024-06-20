import type { Meta } from '@saftox-ui/storybook-solid'
import type { DividerProps } from '../src'

import { divider } from '@saftox-ui/theme'
import { Divider } from '../src'

export default {
  title: 'Components/Divider',
  component: Divider,
  argTypes: {
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
    },
  },
  decorators: [
    (Story) => (
      <div class="flex items-center justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Divider>

const defaultProps = {
  ...divider.defaultVariants,
}

const Template = (args: DividerProps) => (
  <div class="max-w-md">
    <div class="space-y-1">
      <h4 class="text-base font-medium">SaftoxUI Components</h4>
      <p class="text-sm text-default-400">Beautiful, fast and modern Solid UI library.</p>
    </div>
    <Divider class="my-4" />
    <div class="flex h-5 items-center space-x-4 rtl:space-x-reverse text-sm">
      <div>Blog</div>
      <Divider {...args} orientation="vertical" />
      <div>Docs</div>
      <Divider {...args} orientation="vertical" />
      <div>Source</div>
    </div>
  </div>
)

export const Default = {
  render: Template,

  args: {
    ...defaultProps,
  },
}
