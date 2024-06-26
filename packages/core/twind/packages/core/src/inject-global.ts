import type { CSSBase, CSSObject, CSSValue } from './types'

import { tw as tw$ } from './runtime'

import { astish } from './internal/astish'

import { css } from './css'

export interface InjectGlobalFunction {
  (style: CSSBase | string): void

  (strings: TemplateStringsArray, ...interpolations: readonly CSSValue[]): void

  bind(thisArg?: ((tokens: string) => string) | undefined): InjectGlobalFunction

  call(thisArg: ((tokens: string) => string) | undefined, style: CSSBase | string): void

  apply(thisArg: ((tokens: string) => string) | undefined, args: [CSSBase | string]): void
}

/**
 * Injects styles into the global scope and is useful for applications such as gloabl styles, CSS resets or font faces.
 *
 * It **does not** return a class name, but adds the styles within the base layer to the stylesheet directly.
 *
 * @group Style Injectors
 */
export const injectGlobal: InjectGlobalFunction = function injectGlobal(
  this: ((tokens: string) => string) | undefined,
  strings: CSSBase | string | TemplateStringsArray,
  ...interpolations: readonly CSSValue[]
): void {
  const tw = typeof this === 'function' ? this : tw$

  tw(
    css({
      '@layer base': astish(strings as CSSObject, interpolations),
    } as CSSObject),
  )
}
