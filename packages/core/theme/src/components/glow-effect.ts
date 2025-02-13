import type { VariantProps } from '@saftox-ui/variants'

import { radiusClasses } from '../utils/classes'
import { tv } from '../utils/tv'

const glowEffect = tv({
  slots: {
    base: 'absolute h-full m-10 overflow-hidden w-full -left-10 -top-10 z-0',
    svg: 'absolute z-5 h-28 w-28 -translate-x-1/2 -translate-y-1/2',
  },
  variants: {
    radius: radiusClasses,
    color: {
      default: {
        svg: 'bg-[radial-gradient(theme(colors.default)_0%,transparent_70%)]',
      },
      primary: {
        svg: 'bg-[radial-gradient(theme(colors.primary)_0%,transparent_70%)]',
      },
      secondary: {
        svg: 'bg-[radial-gradient(theme(colors.secondary)_0%,transparent_70%)]',
      },
      success: {
        svg: 'bg-[radial-gradient(theme(colors.success)_0%,transparent_70%)]',
      },
      warning: {
        svg: 'bg-[radial-gradient(theme(colors.warning)_0%,transparent_70%)]',
      },
      danger: {
        svg: 'bg-[radial-gradient(theme(colors.danger)_0%,transparent_70%)]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
})

export type GlowEffectVariantProps = VariantProps<typeof glowEffect>

export { glowEffect }
