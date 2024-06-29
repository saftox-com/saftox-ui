import type { Accessor } from 'solid-js'

import { combineProps, combineStyle } from '@solid-primitives/props'
import { mergeRefs, resolveFirst } from '@solid-primitives/refs'
import { access, chain, isObject } from '@solid-primitives/utils'

import { createMemo } from 'solid-js'

const some = (...signals: Accessor<unknown>[]) => {
  return signals.some((signal) => !!signal())
}

function omitProps<T extends Record<string, any>, K extends keyof T>(
  value: T,
  keys: K[],
): Omit<T, K> {
  const newObject = {}

  const currentKeys = Object.keys(value)

  for (let i = 0, len = currentKeys.length; i < len; i += 1) {
    const key = currentKeys[i]
    if (!keys.includes(key as K)) {
      Object.defineProperty(newObject, key as K, {
        get() {
          return value[key as K]
        },
        configurable: true,
        enumerable: true,
      })
    }
  }

  return newObject as Omit<T, K>
}

function pickProps<T extends Record<string, any>, K extends keyof T>(
  value: T,
  keys: K[],
): Pick<T, K> {
  const newObject = {}

  const currentKeys = Object.keys(value)

  for (let i = 0, len = currentKeys.length; i < len; i += 1) {
    const key = currentKeys[i]
    if (keys.includes(key as K)) {
      Object.defineProperty(newObject, key as K, {
        get() {
          return value[key as K]
        },
        configurable: true,
        enumerable: true,
      })
    }
  }

  return newObject as Pick<T, K>
}

type ReactiveObject = Record<string | symbol, any> | any[]

type Spread<T extends ReactiveObject> = {
  [key in keyof T]: Readonly<() => T[key]>
}

type KeyType<T extends ReactiveObject> = T extends any[] ? number : keyof T

function destructure<T extends ReactiveObject>(source: T): Spread<T> {
  const proxy = new Proxy((Array.isArray(source) ? [] : {}) as Spread<T>, {
    get(target, key) {
      const ref = Reflect.get(target, key)
      if (ref) {
        return ref
      }
      const newRef = createMemo(() => source[key as keyof T])
      Reflect.set(target, key, newRef)
      return newRef
    },
  })

  return proxy
}

function spread<T extends ReactiveObject>(source: T): Spread<T> {
  const proxy = (Array.isArray(source) ? [] : {}) as Spread<T>

  for (const key of Object.keys(source)) {
    const k = key as keyof Spread<T>
    proxy[k] = createMemo(() => source[k])
  }

  return proxy
}

export {
  access,
  chain,
  mergeRefs,
  some,
  isObject,
  combineProps,
  combineStyle,
  omitProps,
  pickProps,
  destructure,
  spread,
  resolveFirst,
}
