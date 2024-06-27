import type {
  AriaLabelingProps,
  AriaValidationProps,
  DOMAttributes,
  FocusableDOMProps,
  FocusableProps,
  HelpTextProps,
  InputBase,
  LabelableProps,
  TextInputBase,
  TextInputDOMProps,
  Validation,
  ValidationResult,
  ValueBase,
} from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'

export interface TextFieldProps
  extends InputBase,
    Validation<string>,
    HelpTextProps,
    FocusableProps,
    TextInputBase,
    ValueBase<string>,
    LabelableProps {}

export interface AriaTextFieldProps
  extends TextFieldProps,
    AriaLabelingProps,
    FocusableDOMProps,
    TextInputDOMProps,
    AriaValidationProps {
  // https://www.w3.org/TR/wai-aria-1.2/#textbox
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
  'aria-activedescendant'?: string
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
}

/**
 * A map of HTML element names and their interface types.
 * For example `'a'` -> `HTMLAnchorElement`.
 */
type IntrinsicHTMLElements = {
  [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends JSX.HTMLAttributes<infer T>
    ? T
    : never
}

export type DefaultElementType = 'input'

/**
 * The intrinsic HTML element names that `useTextField` supports; e.g. `input`,
 * `textarea`.
 */
export type TextFieldIntrinsicElements = keyof Pick<IntrinsicHTMLElements, 'input' | 'textarea'>

/**
 * The HTML element interfaces that `useTextField` supports based on what is
 * defined for `TextFieldIntrinsicElements`; e.g. `HTMLInputElement`,
 * `HTMLTextAreaElement`.
 */
export type TextFieldHTMLElementType = Pick<IntrinsicHTMLElements, TextFieldIntrinsicElements>

/**
 * The HTML attributes interfaces that `useTextField` supports based on what
 * is defined for `TextFieldIntrinsicElements`; e.g. `InputHTMLAttributes`,
 * `TextareaHTMLAttributes`.
 */
export type TextFieldHTMLAttributesType = Pick<JSX.IntrinsicElements, TextFieldIntrinsicElements>

/**
 * The type of `inputProps` returned by `useTextField`; e.g. `InputHTMLAttributes`,
 * `TextareaHTMLAttributes`.
 */
export type TextFieldInputProps<T extends TextFieldIntrinsicElements> =
  TextFieldHTMLAttributesType[T]

export interface AriaTextFieldOptions<T extends TextFieldIntrinsicElements>
  extends AriaTextFieldProps {
  /**
   * The HTML element used to render the input, e.g. 'input', or 'textarea'.
   * It determines whether certain HTML attributes will be included in `inputProps`.
   * For example, [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type).
   * @default 'input'
   */
  inputElementType?: T
  /**
   * Controls whether inputted text is automatically capitalized and, if so, in what manner.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize).
   */
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
}

export interface TextFieldAria<T extends TextFieldIntrinsicElements = DefaultElementType> {
  /** Props for the input element. */
  inputProps: TextFieldInputProps<T>
  /** Props for the text field's visible label element, if any. */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement> | DOMAttributes
  /** Props for the text field's description element, if any. */
  descriptionProps: DOMAttributes
  /** Props for the text field's error message element, if any. */
  errorMessageProps: DOMAttributes
  /**  */
  displayValidation: Accessor<ValidationResult | undefined>
}
