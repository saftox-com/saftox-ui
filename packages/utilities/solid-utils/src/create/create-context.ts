import type { Context } from 'solid-js'

import { createContext as createSolidContext, useContext as useSolidContext } from 'solid-js'

import { createKeyedContext, useKeyedContext } from './keyed-context'

export interface CreateContextOptions {
  name: string
  strict?: boolean
}

export type CreateContextReturn<T> = [(contextId?: string) => Context<T>, (contextId?: string) => T]

/**
 * Creates context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<ContextType>(options: CreateContextOptions) {
  const { name, strict = true } = options
  const Context = createSolidContext<ContextType>()
  const isKebabCase = /^[a-z]+(-[a-z]+)*$/.test(name)

  if (!isKebabCase) {
    throw new Error(`[saftox-ui]: createContext name must be kebab case. Received: ${name}`)
  }

  const upperCaseName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  const createContext = (contextId?: string) => {
    if (contextId === undefined) return Context

    const context = createKeyedContext<ContextType>(`{${name}-${contextId}}`)
    return context
  }

  const useContext = (contextId?: string) => {
    const isStrict = !!strict

    if (contextId === undefined) {
      const context = useSolidContext(Context)

      if (!context && isStrict) {
        throw new Error(
          `[saftox-ui]: ${upperCaseName} context not found. Make sure to wrap ${upperCaseName} components in <${upperCaseName}>`,
        )
      }

      return context
    }

    const context = useKeyedContext<ContextType>(`${name}-${contextId}`)
    if (!context && isStrict) {
      throw new Error(
        `[saftox-ui]: ${upperCaseName} context not found. Make sure to wrap ${upperCaseName} components in <${upperCaseName}>",with id "${contextId}" not found. Make sure to wrap ButtonGroup components in <ButtonGroup contextId="${contextId}">`,
      )
    }

    return context
  }

  return [createContext, useContext] as CreateContextReturn<ContextType>
}
