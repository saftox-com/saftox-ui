import type { Meta } from '@saftox-ui/storybook-solid'

import { snippet } from '@saftox-ui/theme'
import { Snippet } from '../src'

export default {
  title: 'Components/Snippet',
  component: Snippet,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['flat', 'solid', 'bordered', 'shadow'],
    },
    color: {
      control: {
        type: 'select',
      },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    radius: {
      control: {
        type: 'select',
      },
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    disableCopy: {
      control: {
        type: 'boolean',
      },
    },
    disableTooltip: {
      control: {
        type: 'boolean',
      },
    },
    hideCopyButton: {
      control: {
        type: 'boolean',
      },
    },
    hideSymbol: {
      control: {
        type: 'boolean',
      },
    },
    symbol: {
      control: {
        type: 'text',
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
} as Meta<typeof Snippet>

const defaultProps = {
  children: 'npm install @saftox-ui/solid',
  symbol: '$',
  disableCopy: false,
  disableTooltip: false,
  hideCopyButton: false,
  hideSymbol: false,
  ...snippet.defaultVariants,
}

export const Default = {
  args: {
    ...defaultProps,
  },
}

export const MultiLine = {
  args: {
    ...defaultProps,
    children: [
      'npm install @saftox-ui/solid',
      'yarn add @saftox-ui/solid',
      'pnpm add @saftox-ui/solid',
    ],
  },
}
