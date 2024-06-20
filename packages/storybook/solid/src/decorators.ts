import type { SolidRenderer } from './types'
import type { Args, DecoratorFunction, LegacyStoryFn, StoryContext } from '@storybook/csf'

import { solidReactivityDecorator } from './render'

import { decorators as docsDecorators } from './docs/config'

export const allDecorators = [solidReactivityDecorator, ...docsDecorators]

export const applyDecorators = (
  storyFn: LegacyStoryFn<SolidRenderer, Args>,
  decorators: DecoratorFunction<SolidRenderer, Args>[],
) => {
  return decorators.reduce(
    (decoratedStoryFn, decorator) => (context: StoryContext<SolidRenderer>) => {
      return decorator(() => decoratedStoryFn(context), context)
    },
    (context: StoryContext<SolidRenderer>) => storyFn(context),
  )
}
