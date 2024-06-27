import type { Accessor, AccessorArray } from 'solid-js'

import { isServer } from '@solid-primitives/utils'

import { createEffect, createSignal, createUniqueId, on } from 'solid-js'

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
 * Used to generate an id, and after render, check if that id is rendered so we know
 * if we can use it in places such as labelledby.
 * @param deps - When to recalculate if the id is in the DOM.
 */
export function createSlotId(
  deps: Accessor<any> | AccessorArray<any>,
): [string, Accessor<boolean>] {
  const id = createId()

  if (isServer) {
    return [id, () => false]
  }

  const [isElementExists, setIsElementExists] = createSignal(false)

  const updateSlotId = () => {
    const elementExists = Boolean(document.getElementById(id))
    setIsElementExists(elementExists)
  }

  createEffect(on(deps, updateSlotId, { defer: true }))

  return [id, isElementExists]
}
