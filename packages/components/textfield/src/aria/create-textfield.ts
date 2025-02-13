import type {
  AriaTextFieldOptions,
  DefaultElementType,
  TextFieldAria,
  TextFieldHTMLElementType,
  TextFieldIntrinsicElements,
} from './textfield-types'
import type { DOMAttributes } from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { createMemo, mergeProps } from 'solid-js'

import { createFocusable } from '@saftox-ui/focus'
import { createFormValidationState } from '@saftox-ui/form'
import { createField } from '@saftox-ui/label'
import { combineProps, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { createControllableSignal, filterDOMProps } from '@saftox-ui/utils'

/**
 * Provides the behavior and accessibility implementation for a text field.
 * @param originalProps - Props for the text field.
 * @param ref - Ref to the HTML input or textarea element.
 */
export function createTextField<T extends TextFieldIntrinsicElements = DefaultElementType>(
  originalProps: AriaTextFieldOptions<T>,
  ref: Accessor<TextFieldHTMLElementType[T] | undefined>,
): TextFieldAria<T> {
  const defaultProps: AriaTextFieldOptions<T> = {
    inputElementType: 'input' as T,
    isDisabled: false,
    isRequired: false,
    isReadOnly: false,
    type: 'text',
    validationBehavior: 'aria',
  }

  const props = mergeProps(defaultProps, originalProps)

  const { focusableProps } = createFocusable(props, ref)

  const [value, setValue] = createControllableSignal<string>({
    value: () => props.value,
    defaultValue: () => props.defaultValue || '',
    onChange: props.onChange,
  })

  const { displayValidation } = createFormValidationState(
    mergeProps(props, {
      get value() {
        return value()
      },
    }),
  )

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField(
    mergeProps(props, displayValidation, {
      get errorMessage() {
        return props.errorMessage || displayValidation().validationErrors
      },
    }),
  )

  const domProps = mergeProps(
    createMemo(() =>
      filterDOMProps(props, { labelable: true, omitEventNames: new Set(['onChange']) }),
    ),
  )

  // TODO: Finish implementing Form Validation & Reset

  // createFormReset(ref, value, setValue)
  // createFormValidation(props, validationState, ref())

  const baseInputProps = mergeProps(
    {
      get type() {
        return props.inputElementType === 'input' ? props.type : undefined
      },
      get pattern() {
        return props.inputElementType === 'input' ? props.pattern : undefined
      },
      get disabled() {
        return props.isDisabled
      },
      get readonly() {
        return props.isReadOnly || undefined
      },
      get required() {
        return props.isRequired && props.validationBehavior === 'native'
      },
      get value() {
        return value()
      },
      get autocomplete() {
        return props.autocomplete
      },
      get autocapitalize() {
        return props.autocapitalize
      },
      get maxLength() {
        return props.maxLength
      },
      get minLength() {
        return props.minLength
      },
      get name() {
        return props.name
      },
      get placeholder() {
        return props.placeholder
      },
      get inputMode() {
        return props.inputMode
      },

      // aria attributes
      get 'aria-required'() {
        return props.isRequired || undefined
      },
      get 'aria-invalid'() {
        return (props.isRequired && props.validationBehavior === 'native') || undefined
      },
      get 'aria-errormessage'() {
        return props['aria-errormessage']
      },
      get 'aria-activedescendant'() {
        return props['aria-activedescendant']
      },
      get 'aria-autocomplete'() {
        return props['aria-autocomplete']
      },
      get 'aria-haspopup'() {
        return props['aria-haspopup']
      },

      // Change events
      onChange: (e: Event) => setValue((e.target as HTMLInputElement).value),

      // Clipboard events
      onCopy: props.onCopy,
      onCut: props.onCut,
      onPaste: props.onPaste,

      // Composition events
      onCompositionEnd: props.onCompositionEnd,
      onCompositionStart: props.onCompositionStart,
      onCompositionUpdate: props.onCompositionUpdate,

      // Selection events
      onSelect: props.onSelect,

      // Input events
      onBeforeInput: props.onBeforeInput,
      onInput: props.onInput,
    } as DOMAttributes,
    focusableProps,
    fieldProps,
  )

  const inputProps = combineProps(domProps, baseInputProps)

  return {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    displayValidation,
  }
}
