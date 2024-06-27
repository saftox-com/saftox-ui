import type { AriaLabelProps, LabelAria } from './create-label'
import type { DOMAttributes, HelpTextProps, Validation } from '@saftox-ui/types'

import { createLabel } from './create-label'

import { createMemo } from 'solid-js'

import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { createSlotId } from '@saftox-ui/utils'

export interface AriaFieldProps
  extends AriaLabelProps,
    HelpTextProps,
    Omit<Validation<any>, 'isRequired'> {}

export interface FieldAria extends LabelAria {
  /** Props for the description element, if any.*/
  descriptionProps: DOMAttributes
  /** Props for the error message element, if any. */
  errorMessageProps: DOMAttributes
}

/**
 * Provides the accessibility implementation for input fields.
 * Fields accept user input, gain context from their label, and may display a description or error message.
 * @param props - Props for the Field.
 */
export function createField(props: AriaFieldProps): FieldAria {
  const { labelProps, fieldProps } = createLabel(props)

  const deps = createMemo(() => {
    return [
      Boolean('description' in props),
      Boolean('errorMessage' in props),
      Boolean(props.isInvalid),
      Boolean(props.validationState),
    ]
  })

  const [descriptionId, descriptionIdExists] = createSlotId(deps)
  const [errorMessageId, errorMessageIdExists] = createSlotId(deps)

  const baseFieldProps: DOMAttributes = {
    get 'aria-describedby'() {
      const describedby = createMemo(() => [
        descriptionIdExists() && descriptionId,
        // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
        // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
        errorMessageIdExists() && errorMessageId,
        props['aria-describedby'],
      ])

      return describedby().filter(Boolean).join(' ') || undefined
    },
  }

  const descriptionProps: DOMAttributes = {
    id: descriptionId,
  }

  const errorMessageProps: DOMAttributes = {
    id: errorMessageId,
  }

  return {
    labelProps,
    fieldProps: combineProps(fieldProps, baseFieldProps),
    descriptionProps,
    errorMessageProps,
  }
}
