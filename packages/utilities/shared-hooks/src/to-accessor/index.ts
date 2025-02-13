import type { MaybeAccessor } from '../utils'
import type { Accessor } from 'solid-js'

export function isAccessor<T>(val?: unknown): val is Accessor<T> {
  return typeof val === 'function'
}
/**
 * Normalize value/accessor/getter to `Accessor`.
 */
export function toAccessor<T>(r: MaybeAccessor<T>): Accessor<T> {
  return isAccessor<T>(r) ? r : () => r
}

/**
 * @deprecated use `toAccessor` instead
 */
export const resolveAccessor = toAccessor
