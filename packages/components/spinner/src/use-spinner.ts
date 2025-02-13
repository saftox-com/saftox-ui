import type { UseSpinnerProps } from './spinner-types'

import { createMemo, splitProps } from 'solid-js'

import { clsx } from '@saftox-ui/shared-utils'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants } from '@saftox-ui/system-ssc'
import { spinner } from '@saftox-ui/theme'

export function useSpinner(originalProps: UseSpinnerProps) {
  const [omitVariantProps, variantProps] = mapPropsVariants(originalProps, spinner.variantKeys)

  const [local, rest] = splitProps(omitVariantProps, ['class', 'classes', 'label', 'children'])

  const slots = createMemo(() => spinner(variantProps))

  const label = () => local.label || local.children

  const getSpinnerProps = combineProps(rest, {
    get 'aria-label'() {
      if (label() && typeof label() === 'string') {
        return label() as string
      }

      return !rest['aria-label'] ? 'Loading' : ''
    },
    class: slots().base({
      class: clsx(local.classes?.base, local.class),
    }),
  })

  return {
    label,
    slots,
    getSpinnerProps,
  }
}

export type UseSpinnerReturn = ReturnType<typeof useSpinner>
