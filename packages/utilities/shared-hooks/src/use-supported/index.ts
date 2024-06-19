import type { Accessor } from 'solid-js'

import { createMemo } from 'solid-js'

import { useMounted } from '../use-mounted'

/**
 * SSR compatibility `isSupported`
 */
export function useSupported(callback: () => unknown): Accessor<boolean> {
  const isMounted = useMounted()

  return createMemo(() => {
    isMounted()
    return Boolean(callback())
  })
}
