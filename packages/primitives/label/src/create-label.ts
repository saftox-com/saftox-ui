import type { MaybeAccessor } from '@saftox-ui/solid-utils/reactivity'
import type { AriaLabelingProps, DOMProps, LabelableProps } from '@saftox-ui/types'
import type { JSX } from 'solid-js'

import { mergeProps, splitProps } from 'solid-js'

import { createId, mergeAriaLabels } from '@saftox-ui/utils'

export interface AriaLabelProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * Whether the HTML element used to render the label is a <label>.
   * @default true
   */
  isHTMLLabelElement?: MaybeAccessor<boolean | undefined>
}

export interface LabelAria {
  /**
   * Props to apply to the label container element.
   */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>

  /**
   * Props to apply to the field container element being labeled.
   */
  fieldProps: DOMProps & AriaLabelingProps
}

/**
 * Provides the accessibility implementation for labels and their associated elements.
 * Labels provide context for user inputs.
 * @param originalProps - The props for labels and fields.
 */
export function createLabel(originalProps: AriaLabelProps): LabelAria {
  const defaultFieldId = createId()
  const labelId = createId()

  const defaultProps: AriaLabelProps = {
    id: defaultFieldId,
    isHTMLLabelElement: true,
  }

  const props = mergeProps(defaultProps, originalProps)

  const [local] = splitProps(props, [
    'id',
    'label',
    'aria-labelledby',
    'aria-label',
    'isHTMLLabelElement',
  ])

  const labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement> = {
    get id() {
      return local.label ? labelId : undefined
    },
    get for() {
      return local.label && local.isHTMLLabelElement ? local.id : undefined
    },
  }

  const ariaLabelledby = () => {
    if (!local.label) {
      return local['aria-labelledby']
    }

    return local['aria-labelledby'] ? `${local['aria-labelledby']} ${labelId}` : labelId
  }

  const { ariaLabelsProps: fieldProps } = mergeAriaLabels({
    id: () => local.id,
    'aria-label': () => local['aria-label'],
    'aria-labelledby': ariaLabelledby,
  })

  return { labelProps, fieldProps }
}
