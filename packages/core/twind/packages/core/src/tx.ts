import type { Class } from './types'

import { tw as tw$ } from './runtime'

import { interpolate } from './internal/interpolate'

export interface TxFunction {
  (...classes: Class[]): string

  (strings: TemplateStringsArray, ...interpolations: readonly Class[]): string

  bind(thisArg?: ((tokens: string) => string) | undefined): TxFunction

  call(thisArg: ((tokens: string) => string) | undefined, ...classes: Class[]): string
  call(
    thisArg: ((tokens: string) => string) | undefined,
    strings: TemplateStringsArray,
    ...interpolations: readonly Class[]
  ): string

  apply(
    thisArg: ((tokens: string) => string) | undefined,
    classes: Class[] | [strings: TemplateStringsArray, ...interpolations: readonly Class[]],
  ): string
}

/**
 * Combines {@link tw} and {@link cx}.
 *
 * Using the default `tw` instance:
 *
 * ```js
 * import { tw } from '@saftox-ui/twind'
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 *
 * // using a custom twind instance
 * import { tw } from './custom/twind'
 * import { tw } from './custom/twind'
 * tx.bind(tw)
 * ```
 *
 * Using a custom `tw` instance:
 *
 * ```js
 * import { tx as tx$ } from '@saftox-ui/twind'
 * import { tw } from './custom/twind'
 *
 * export const tx = tx$.bind(tw)
 *
 * tx`underline ${falsy && 'italic'}`
 * tx('underline', falsy && 'italic')
 * tx({'underline': true, 'italic': false})
 * ```
 *
 * @group Style Injectors
 * @param this {@link Twind} instance to use (default: {@link tw})
 * @param strings
 * @param interpolations
 * @returns the class name
 */
export const tx: TxFunction = function tx(
  this: ((tokens: string) => string) | undefined,
  strings: TemplateStringsArray | Class,
  ...interpolations: Class[]
): string {
  const tw = typeof this === 'function' ? this : tw$

  return tw(interpolate(strings, interpolations))
}
