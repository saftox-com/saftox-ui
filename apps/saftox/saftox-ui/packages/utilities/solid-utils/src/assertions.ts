const isFunction = <T extends Function = Function>(value: unknown): value is T => {
  return typeof value === 'function'
}

const buttonInputTypes = ['button', 'color', 'file', 'image', 'reset', 'submit']

const isButton = (tagName: string, type?: string) => {
  if (tagName === 'button') return true
  if (tagName === 'input' && type !== undefined) {
    return buttonInputTypes.indexOf(type) !== -1
  }
  return false
}

const dataIf = (condition: boolean) => (condition ? '' : undefined)

type SSRElement = { t: string }

const isSSRElement = (input: unknown): input is SSRElement => {
  return (
    !!input &&
    typeof input === 'object' &&
    't' in input &&
    typeof input.t === 'string' &&
    /^<[a-z]/i.test(input.t.trimStart())
  )
}

const isBrowserElement = (input: unknown): input is Element => {
  return globalThis.Element && input instanceof Element
}

const isElement = (input: unknown): input is SSRElement | Element => {
  return isBrowserElement(input) || isSSRElement(input)
}

export { isFunction, isButton, dataIf, isSSRElement, isBrowserElement, isElement }

export type { SSRElement }
