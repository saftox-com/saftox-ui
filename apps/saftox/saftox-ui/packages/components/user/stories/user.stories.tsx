import type { Meta } from '@saftox-ui/storybook-solid'

import { User } from '../src'

export default {
  title: 'Components/User',
  component: User,
  decorators: [
    (Story: any) => (
      <div class="flex items-center justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof User>

const url = 'https://avatars.githubusercontent.com/u/32131367?v=4'

export const Default = {
  args: {
    name: 'Serhii Zaitsev',
    avatarProps: {
      src: url,
    },
  },
}

export const isFocusable = {
  args: {
    name: 'Serhii Zaitsev',
    isFocusable: true,
    avatarProps: {
      src: url,
    },
  },
}

export const WithDefaultAvatar = {
  args: {
    name: 'Serhii Zaitsev',
    avatarProps: {
      name: 'Serhii Zaitsev',
      getInitials: (name: string) =>
        name
          .split(' ')
          .map((n) => n[0])
          .join(''),
    },
  },
}

export const WithDescription = {
  args: {
    name: 'Serhii Zaitsev',
    description: 'Software Engineer',
    avatarProps: {
      src: url,
    },
  },
}

export const WithLinkDescription = {
  args: {
    name: 'Serhii Zaitsev',
    description: '@zaitsev_dev',
    avatarProps: {
      src: url,
    },
  },
}
