import type { Accessor } from 'solid-js'

import { isServer, noop } from '@solid-primitives/utils'
import { createSignal, createUniqueId, getListener, onCleanup } from 'solid-js'

export const ID_PREFIX = 'saftox-ui'

/**
 * Create a universal id that is stable across server/browser.
 * @param prefix An optional prefix for the generated id.
 * @returns The generated id.
 */
export function createId(prefix = ID_PREFIX): string {
  return `${prefix}-${createUniqueId()}`
}

/**
 * Create a universal id that will be set to `undefined` if not attached to an element.
 * @param prefix An optional prefix for the generated id.
 * @param deps Dependencies that should trigger an id usage check.
 * @returns An accessor for the generated id.
 */
export function createSlotId(
  prefix?: string,
): [id: Accessor<string | undefined>, track: VoidFunction] {
  const id = createId(prefix)

  if (isServer) return [() => id, noop]

  const [slotId, setSlotId] = createSignal<string | undefined>(id)

  const updateSlotId = () => setSlotId(document.getElementById(id) ? id : undefined)
  queueMicrotask(updateSlotId)

  const track = () => {
    queueMicrotask(updateSlotId)
    getListener() && onCleanup(updateSlotId)
  }

  return [slotId, track]
}
