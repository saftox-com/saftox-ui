import type { Accessor } from 'solid-js'

import { createMemo } from 'solid-js'

/**
 * Change mutable object to Accessors.
 *
 */
export function toAccessors<T extends object = {}>(
  props: T,
  defaultProps?: T,
): Record<keyof T, Accessor<T[keyof T]>> {
  const obj: any = {}
  for (const key of Object.keys(props) as Array<keyof T>) {
    obj[key] = createMemo(() => props[key] ?? defaultProps?.[key])
  }
  return obj
}
