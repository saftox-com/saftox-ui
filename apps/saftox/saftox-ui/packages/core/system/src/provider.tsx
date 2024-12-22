import type { ProviderContextProps } from './provider-context'
import type { I18nProviderProps } from '@saftox-ui/i18n'
import type { DOMAttributes } from '@saftox-ui/system-ssc'
import type { Component, JSX } from 'solid-js'

import { createProviderContext } from './provider-context'

import { createMemo, mergeProps, splitProps } from 'solid-js'

import { I18nProvider } from '@saftox-ui/i18n'

export interface SaftoxUIProviderProps extends DOMAttributes, ProviderContextProps {
  children: JSX.Element | JSX.Element[]
  /**
   * Controls whether `motion` animations are skipped within the application.
   * This property is automatically enabled (`true`) when the `disableAnimation` prop is set to `true`,
   * effectively skipping all `motion` animations. To retain `motion` animations while
   * using the `disableAnimation` prop for other purposes, set this to `false`. However, note that
   * animations in SaftoxUI Components are still omitted if the `disableAnimation` prop is `true`.
   */
  skipMotionAnimations?: boolean
  /**
   * The locale to apply to the children.
   * @default "en-US"
   */
  locale?: I18nProviderProps['locale']
}

export const SaftoxUIProvider: Component<SaftoxUIProviderProps> = (originalProps) => {
  const defaultProps: Omit<SaftoxUIProviderProps, 'children'> = {
    disableAnimation: false,
    skipMotionAnimations: false,
    validationBehavior: 'aria',
    locale: 'en-US',
  }

  const props = mergeProps(defaultProps, originalProps)

  const [local, rest] = splitProps(props, [
    'disableAnimation',
    'skipMotionAnimations',
    'validationBehavior',
    'locale',
  ])

  const ProviderContext = createProviderContext()

  const context = createMemo(() => {
    if (local.disableAnimation && local.skipMotionAnimations) {
      // TOTO: skip animations in SaftoxUI components
    }

    return {
      get disableAnimation() {
        return local.disableAnimation
      },
      get skipMotionAnimations() {
        return local.skipMotionAnimations
      },
      get validationBehavior() {
        return local.validationBehavior
      },
      get locale() {
        return local.locale
      },
    }
  })

  return (
    <ProviderContext.Provider value={context()}>
      <I18nProvider locale={local.locale}>{props.children}</I18nProvider>
    </ProviderContext.Provider>
  )
}
