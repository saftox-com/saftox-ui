import type {
  AriaLabelingProps,
  AriaValidationProps,
  DOMAttributes,
  FocusableDOMProps,
  FocusableProps,
  HelpTextProps,
  InputBase,
  IntrinsicHTMLElements,
  LabelableProps,
  TextInputBase,
  TextInputDOMProps,
  Validation,
  ValueBase,
} from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'

import { createMemo, mergeProps } from 'solid-js'

import { createFocusable } from '@saftox-ui/focus'
import { createField } from '@saftox-ui/label'
import { callHandler, filterDOMProps } from '@saftox-ui/utils'

type DefaultElementType = 'input'

/**
 * The intrinsic HTML element names that `createTextField` supports; e.g. `input`, `textarea`.
 */
type TextFieldIntrinsicElements = keyof Pick<IntrinsicHTMLElements, 'input' | 'textarea'>

/**
 * The HTML element interfaces that `createTextField` supports based on what is
 * defined for `TextFieldIntrinsicElements`; e.g. `HTMLInputElement`, `HTMLTextAreaElement`.
 */
type TextFieldHTMLElementType = Pick<IntrinsicHTMLElements, TextFieldIntrinsicElements>

/**
 * The HTML attributes interfaces that `createTextField` supports based on what
 * is defined for `TextFieldIntrinsicElements`; e.g. `InputHTMLAttributes`, `TextareaHTMLAttributes`.
 */
type TextFieldHTMLAttributesType = Pick<JSX.IntrinsicElements, TextFieldIntrinsicElements>

/**
 * The type of `inputProps` returned by `createTextField`; e.g. `InputHTMLAttributes`, `TextareaHTMLAttributes`.
 */
type TextFieldInputProps<T extends TextFieldIntrinsicElements> = TextFieldHTMLAttributesType[T]

export interface AriaTextFieldProps<T extends TextFieldIntrinsicElements>
  extends InputBase,
    Validation,
    HelpTextProps,
    FocusableProps,
    TextInputBase,
    ValueBase<string>,
    LabelableProps,
    AriaLabelingProps,
    FocusableDOMProps,
    TextInputDOMProps,
    AriaValidationProps {
  /**
   * Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
   * See https://www.w3.org/TR/wai-aria-1.2/#textbox.
   */
  'aria-activedescendant'?: string

  /**
   * Indicates whether inputting text could trigger display of one or more predictions
   * of the user's intended value for an input
   * and specifies how predictions would be presented if they are made.
   */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'

  /**
   * Indicates the availability and type of interactive popup element,
   * such as menu or dialog, that can be triggered by an element.
   */
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

  /**
   * The HTML element used to render the input, e.g. 'input', or 'textarea'.
   * It determines whether certain HTML attributes will be included in `inputProps`.
   * For example, [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type).
   * @default 'input'
   */
  inputElementType?: T
}

export interface TextFieldAria<T extends TextFieldIntrinsicElements = DefaultElementType> {
  /**
   * Props for the input element.
   */
  inputProps: TextFieldInputProps<T>

  /**
   * Props for the text field's visible label element, if any.
   */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>

  /**
   * Props for the text field's description element, if any.
   */
  descriptionProps: DOMAttributes

  /**
   * Props for the text field's error message element, if any.
   */
  errorMessageProps: DOMAttributes
}

/**
 * Provides the behavior and accessibility implementation for a text field.
 * @param originalProps - Props for the text field.
 * @param ref - Ref to the HTML input or textarea element.
 */
export function createTextField<T extends TextFieldIntrinsicElements = DefaultElementType>(
  originalProps: AriaTextFieldProps<T>,
  ref: Accessor<TextFieldHTMLElementType[T] | undefined>,
): TextFieldAria<T> {
  const defaultProps: AriaTextFieldProps<TextFieldIntrinsicElements> = {
    type: 'text',
    inputElementType: 'input',
    isDisabled: false,
    isRequired: false,
    isReadOnly: false,
  }

  const props = mergeProps(defaultProps, originalProps) as AriaTextFieldProps<T>

  const { focusableProps } = createFocusable(props, ref)
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField(props)

  const domProps = mergeProps(createMemo(() => filterDOMProps(props, { labelable: true })))

  const inputProps: JSX.HTMLAttributes<any> = mergeProps(
    domProps,
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
      get readOnly() {
        return props.isReadOnly || undefined
      },
      get 'aria-required'() {
        return props.isRequired || undefined
      },
      get 'aria-invalid'() {
        return props.validationState === 'invalid' || undefined
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
      get value() {
        return props.value
      },
      get defaultValue() {
        return props.value ? undefined : props.defaultValue
      },
      get autocomplete() {
        return props.autocomplete
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

      // Change events
      onChange: (e) => props.onChange?.((e.target as HTMLInputElement).value),

      // Clipboard events
      onCopy: (e) => callHandler(props.onCopy, e),
      onCut: (e) => callHandler(props.onCut, e),
      onPaste: (e) => callHandler(props.onPaste, e),

      // Composition events
      onCompositionEnd: (e) => callHandler(props.onCompositionEnd, e),
      onCompositionStart: (e) => callHandler(props.onCompositionStart, e),
      onCompositionUpdate: (e) => callHandler(props.onCompositionUpdate, e),

      // Selection events
      onSelect: (e) => callHandler(props.onSelect, e),

      // Input events
      onBeforeInput: (e) => callHandler(props.onBeforeInput, e),
      onInput: (e) => callHandler(props.onInput, e),
    } as JSX.HTMLAttributes<any>,
    focusableProps,
    fieldProps,
  )

  // const inputProps = combineProps(domProps, baseInputProps);

  return {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
  }
}
