import type { JSX } from 'solid-js'

export type ValidationState = 'valid' | 'invalid'

export type ValidationError = string | string[]
export type ValidationErrors = Record<string, ValidationError>
export type ValidationFunction<T> = (value: T) => ValidationError | true | null | undefined

export interface Validation<T = unknown> {
  /** Indicates if user input is mandatory before submitting the form. */
  isRequired?: boolean
  /** Indicates if the input value does not meet the validation criteria. */
  isInvalid?: boolean
  /** @deprecated Use `isInvalid` instead. */
  validationState?: ValidationState
  /**
   * Determines whether to employ native HTML form validation to block form submission
   * when the value is missing or invalid, or to denote the field as required
   * or invalid using ARIA attributes.
   * @default 'aria'
   */
  validationBehavior?: 'aria' | 'native'
  /**
   * A function that provides an error message if the provided value fails validation.
   * These validation errors are shown to the user upon form submission if `validationBehavior="native"`.
   * For immediate feedback, utilize the `isInvalid` property.
   */
  validate?: (value: T) => ValidationError | true | null | undefined
}

export interface ValidationResult {
  /** Indicates if the input value fails validation. */
  isInvalid: boolean
  /** Lists the current error messages for the input if it is invalid, otherwise returns an empty array. */
  validationErrors: string[]
  /** Provides native validation details for the input. */
  validationDetails: ValidityState
}

export interface AriaValidationProps {
  /**
   * Specifies the element that delivers an error message for the object.
   * @see https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
   */
  'aria-errormessage'?: string
}

export interface InputBase {
  /** Specifies if the input is disabled. */
  isDisabled?: boolean
  /** Specifies if the input is selectable but cannot be modified by the user. */
  isReadOnly?: boolean
}

export interface ValueBase<T, C = T> {
  /** Holds the current value (controlled). */
  value?: T
  /** Sets the initial value (uncontrolled). */
  defaultValue?: T
  /** Triggers when the value changes. */
  onChange?: (value: C) => void
}

export interface TextInputBase {
  /** Displays temporary text in the text input when it is empty. */
  placeholder?: string
}

export interface RangeValue<T> {
  /** Defines the starting value of the range. */
  start: T
  /** Defines the ending value of the range. */
  end: T
}

export interface RangeInputBase<T> {
  /** Defines the minimum allowable value for the input. */
  minValue?: T
  /** Defines the maximum allowable value for the input. */
  maxValue?: T
  /** Specifies the value increment or decrement per "tick". */
  step?: T // ??
}

export interface HelpTextProps {
  /** Provides a hint or guidelines for the field, such as specific requirements for selection. */
  description?: JSX.Element
  /** Displays an error message for the field. */
  errorMessage?: JSX.Element | ((v: ValidationResult) => JSX.Element)
}
