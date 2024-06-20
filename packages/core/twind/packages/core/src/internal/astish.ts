import type { CSSObject, CSSValue } from '../types'

import { interleave } from './interleave'

export function astish(
  strings: CSSObject | string | TemplateStringsArray,
  interpolations: readonly CSSValue[],
): CSSObject[] {
  return Array.isArray(strings)
    ? astish$(
        interleave(strings as TemplateStringsArray, interpolations as string[], (interpolation) =>
          interpolation != null && typeof interpolation !== 'boolean'
            ? (interpolation as unknown as string)
            : '',
        ),
      )
    : typeof strings === 'string'
      ? astish$(strings)
      : [strings as CSSObject]
}

// Based on https://github.com/cristianbote/goober/blob/master/src/core/astish.js
const newRule = / *(?:(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}))/g

function astish$(originalCss: string): CSSObject[] {
  let css: string = originalCss

  css = removeComments(css)

  const root: CSSObject = {}
  const stack: Array<{ conditions: string[]; rule: CSSObject }> = [{ conditions: [], rule: root }]

  let block: RegExpExecArray | null

  while ((block = newRule.exec(css))) {
    if (block[4]) {
      stack.shift()
    } else {
      const current = stack[0] as { conditions: string[]; rule: CSSObject }
      if (block[3]) {
        const newRule: CSSObject = {}
        current.rule[block[3]] = newRule
        stack.unshift({ conditions: [block[3]], rule: newRule })
      } else {
        if (Object.hasOwn(current.rule, block[1] as string)) {
          const newRule: CSSObject = {}

          for (let i = 0; i < current.conditions.length; i++) {
            const condition = current.conditions[i]
            current.rule[condition as string] = newRule
          }

          stack.unshift({
            conditions: current.conditions.slice(),
            rule: newRule,
          })
        }
        current.rule[block[1] as string] = block[2]
      }
    }
  }

  return [root]
}

// Remove comments (multiline and single line)
function removeComments(css: string): string {
  // biome-ignore lint/correctness/noEmptyCharacterClassInRegex: <explanation>
  return css.replace(/\/\*[^]*?\*\/|\s\s+|\n/gm, ' ')
}
