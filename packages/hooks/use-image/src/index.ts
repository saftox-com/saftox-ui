import type { MaybeAccessor } from '@saftox-ui/shared-hooks/utils'
import type { UseAsyncStateOptions } from '@saftox-ui/use-async-state'

import { createEffect, on } from 'solid-js'

import { toValue } from '@saftox-ui/shared-hooks/to-value'
import { useAsyncState } from '@saftox-ui/use-async-state'

export interface UseImageOptions {
  /** Address of the resource */
  src?: string
  /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
  srcset?: string
  /** Image sizes for different page layouts */
  sizes?: string
  /** Image alternative information */
  alt?: string
  /** Image classes */
  class?: string
  /** Image loading */
  loading?: HTMLImageElement['loading']
  /** Image CORS settings */
  crossorigin?: string
  /** Referrer policy for fetch https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy */
  referrerPolicy?: HTMLImageElement['referrerPolicy']
}

function loadImage(options: UseImageOptions): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const { src, srcset, sizes, class: clazz, loading, crossorigin, referrerPolicy } = options

    if (!src) {
      return
    }

    img.src = src
    if (srcset) img.srcset = srcset
    if (sizes) img.sizes = sizes
    if (clazz) img.className = clazz
    if (loading) img.loading = loading
    if (crossorigin) img.crossOrigin = crossorigin
    if (referrerPolicy) img.referrerPolicy = referrerPolicy

    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

/**
 * Reactive load an image in the browser, you can wait the result to display it or show a fallback.
 * @param options Image attributes, as used in the <img> tag
 */
export const useImage = (
  options: MaybeAccessor<UseImageOptions>,
  asyncStateOptions: UseAsyncStateOptions = {},
) => {
  const state = useAsyncState<HTMLImageElement | undefined>(
    () => loadImage(toValue(options)),
    undefined,
    {
      resetOnExecute: true,
      ...asyncStateOptions,
    },
  )

  createEffect(
    on(
      () => toValue(options),
      () => {
        state.execute(asyncStateOptions.delay)
      },
      { defer: true },
    ),
  )

  return state
}

export type UseImageReturn = ReturnType<typeof useImage>
