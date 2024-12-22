// import { Card } from "@saftox-ui/card";
import { Button } from '@saftox-ui/button'
import type { Meta } from '@saftox-ui/storybook-solid'
import { skeleton } from '@saftox-ui/theme'

import { createSignal } from 'solid-js'
import type { SkeletonProps } from '../src'
import { Skeleton } from '../src'

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    children: {
      hidden: true,
    },
    isLoaded: {
      control: {
        type: 'boolean',
      },
    },
    disableAnimation: {
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta<typeof Skeleton>

const defaultProps = {
  ...skeleton.defaultVariants,
  isLoaded: false,
  children: <div class="w-[200px] h-[100px]">NextUI</div>,
}

const DefaultTemplate = (args: SkeletonProps) => (
  <div class="w-[200px] space-y-5 p-4 rounded-large bg-content1">
    <Skeleton class="rounded-lg" {...args}>
      <div class="h-24 rounded-lg bg-default-300" />
    </Skeleton>
    <div class="space-y-3">
      <Skeleton class="w-3/5 rounded-lg" {...args}>
        <div class="h-3 w-3/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton class="w-4/5 rounded-lg" {...args}>
        <div class="h-3 w-4/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton class="w-2/5 rounded-lg" {...args}>
        <div class="h-3 w-2/5 rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  </div>
)

const StandaloneTemplate = (args: SkeletonProps) => (
  <div class="max-w-[300px] w-full flex items-center gap-3">
    <div>
      <Skeleton class="flex rounded-full w-12 h-12" />
    </div>
    <div class="w-full flex flex-col gap-2">
      <Skeleton class="h-3 w-3/5 rounded-lg" {...args} />
      <Skeleton class="h-3 w-4/5 rounded-lg" {...args} />
    </div>
  </div>
)

const LoadedStateTemplate = (args: SkeletonProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false)

  const toggleLoad = () => {
    setIsLoaded(!isLoaded)
  }

  return (
    <div class="flex flex-col gap-3">
      <div class="w-[200px] space-y-5 p-4 rounded-large bg-content1">
        <Skeleton class="rounded-lg" {...args} isLoaded={isLoaded()}>
          <div class="h-24 rounded-lg bg-secondary" />
        </Skeleton>
        <div class="space-y-3">
          <Skeleton class="w-3/5 rounded-lg" {...args} isLoaded={isLoaded()}>
            <div class="h-3 w-full rounded-lg bg-secondary" />
          </Skeleton>
          <Skeleton class="w-4/5 rounded-lg" {...args} isLoaded={isLoaded()}>
            <div class="h-3 w-full rounded-lg bg-secondary-300" />
          </Skeleton>
          <Skeleton class="w-2/5 rounded-lg" {...args} isLoaded={isLoaded()}>
            <div class="h-3 w-full rounded-lg bg-secondary-200" />
          </Skeleton>
        </div>
      </div>
      <Button class="max-w-[200px]" color="secondary" size="sm" variant="flat" onPress={toggleLoad}>
        {isLoaded() ? 'Show' : 'Hide'} Skeleton
      </Button>
    </div>
  )
}

export const Default = {
  render: DefaultTemplate,

  args: {
    ...defaultProps,
  },
}

export const Standalone = {
  render: StandaloneTemplate,

  args: {
    ...defaultProps,
  },
}

export const LoadedState = {
  render: LoadedStateTemplate,

  args: {
    ...defaultProps,
  },
}
