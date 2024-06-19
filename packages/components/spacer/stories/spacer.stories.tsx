import type { Meta } from '@saftox-ui/storybook-solid'
import { spacer } from '@saftox-ui/theme'

import type { SpacerProps } from '../src'
import { Spacer } from '../src'

export default {
  title: 'Components/Spacer',
  component: Spacer,
  argTypes: {
    x: {
      control: {
        type: 'number',
      },
    },
    y: {
      control: {
        type: 'number',
      },
    },
    isInline: {
      control: {
        type: 'boolean',
      },
    },
  },
  decorators: [
    (Story) => (
      <div class="flex items-center justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Spacer>

const defaultProps = {
  ...spacer.defaultVariants,
}

const content = () => (
  <div class="flex flex-col w-[300px] h-[100px] bg-primary rounded-xl shadow-lg" />
)

const VerticalTemplate = (args: SpacerProps) => (
  <div class="flex flex-col">
    {content()}
    <Spacer {...args} />
    {content()}
    <Spacer {...args} />
    {content()}
  </div>
)

const HorizontalTemplate = (args: SpacerProps) => (
  <div class="flex flex-row">
    {content()}
    <Spacer {...args} />
    {content()}
    <Spacer {...args} />
    {content()}
  </div>
)

export const Vertical = {
  render: VerticalTemplate,

  args: {
    ...defaultProps,
    y: 1,
  },
}

export const Horizontal = {
  render: HorizontalTemplate,

  args: {
    ...defaultProps,
    x: 1,
    isInline: true,
  },
}
