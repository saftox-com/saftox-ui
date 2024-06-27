import type { UseCodeProps } from './code-types'
import type { PropGetter } from '@saftox-ui/system'

import { mergeProps, splitProps } from 'solid-js'

import { mapPropsVariants } from '@saftox-ui/system'
import { code } from '@saftox-ui/theme'

export function useCode(originalProps: UseCodeProps) {
  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, code.variantKeys)

  const [local, rest] = splitProps(omitVariantProps, ['ref', 'as', 'class'])

  const Component = local.as || 'code'

  const classes = () =>
    code(
      mergeProps(variantProps, {
        get class() {
          return local.class
        },
      }),
    )

  const getCodeProps: PropGetter = () =>
    mergeProps(
      {
        ref: local.ref,
        get class() {
          return classes()
        },
      },
      rest,
    )

  return {
    Component,
    getCodeProps,
  }
}

export type UseCodeReturn = ReturnType<typeof useCode>
