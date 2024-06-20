import { onCleanup } from 'solid-js'

interface GlobalListeners {
  addGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void

  addGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void

  removeGlobalListener<K extends keyof DocumentEventMap>(
    el: EventTarget,
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void

  removeGlobalListener(
    el: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void

  removeAllGlobalListeners(): void
}

export function createGlobalListeners(): GlobalListeners {
  const globalListeners = new Map()

  const addGlobalListener = (eventTarget: any, type: any, listener: any, options: any) => {
    // Make sure we remove the listener after it is called with the `once` option.
    const fn = options?.once
      ? (...args: any) => {
          globalListeners.delete(listener)
          listener(...args)
        }
      : listener
    globalListeners.set(listener, { type, eventTarget, fn, options })
    eventTarget.addEventListener(type, listener, options)
  }

  const removeGlobalListener = (eventTarget: any, type: any, listener: any, options: any) => {
    const fn = globalListeners.get(listener)?.fn || listener
    eventTarget.removeEventListener(type, fn, options)
    globalListeners.delete(listener)
  }

  const removeAllGlobalListeners = () => {
    globalListeners.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options)
    })
  }

  onCleanup(() => {
    removeAllGlobalListeners()
  })

  return { addGlobalListener, removeGlobalListener, removeAllGlobalListeners }
}
