import type { AriaTextFieldOptions } from './aria/textfield-types'
import type { Ref } from '@saftox-ui/solid-utils/dom'
import type { HTMLSaftoxUIProps } from '@saftox-ui/system'
import type { SlotsToClasses, TextfieldSlots, TextfieldVariantProps } from '@saftox-ui/theme'
import type { Accessor, JSX, MergeProps } from 'solid-js'

// type Ref<T> = T | ((el: T) => void) | undefined;

export interface Props<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>
  extends Omit<HTMLSaftoxUIProps<'input' | 'textarea'>, keyof TextfieldVariantProps> {
  /**
   * Ref to the DOM node.
   */
  ref?: Ref<T>
  /**
   * Ref to the container DOM node.
   */
  baseRef?: Ref<HTMLDivElement>
  /**
   * Ref to the input wrapper DOM node.
   * This is the element that wraps the input label and the innerWrapper when the labelPlacement="inside"
   * and the input has start/end content.
   */
  wrapperRef?: Ref<HTMLDivElement>
  /**
   * Ref to the input inner wrapper DOM node.
   * This is the element that wraps the input and the start/end content when passed.
   */
  innerWrapperRef?: Ref<HTMLDivElement>
  /**
   * Element to be rendered in the left side of the input.
   */
  startContent?: JSX.Element
  /**
   * Element to be rendered in the right side of the input.
   * if you pass this prop and the `onClear` prop, the passed element
   * will have the clear button props and it will be rendered instead of the
   * default clear button.
   */
  endContent?: JSX.Element
  /**
   * Classname or List of classes to change the classess of the element.
   * if `class` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Input classes={{
   *    base:"base-classes",
   *    label: "label-classes",
   *    mainWrapper: "main-wrapper-classes",
   *    inputWrapper: "input-wrapper-classes",
   *    innerWrapper: "inner-wrapper-classes",
   *    input: "input-classes",
   *    clearButton: "clear-button-classes",
   *    helperWrapper: "helper-wrapper-classes",
   *    description: "description-classes",
   *    errorMessage: "error-message-classes",
   * }} />
   * ```
   */
  classes?: SlotsToClasses<TextfieldSlots>
  /**
   * Callback fired when the value is cleared.
   * if you pass this prop, the clear button will be shown.
   */
  onClear?: () => void
  /**
   * onChange event.
   */
  onValueChange?: (value: string) => void
  /**
   * onInput event.
   */
  onValueInput?: (value: string) => void
}

export type UseTextfieldProps<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> =
  Props<T> &
    Omit<AriaTextFieldOptions<'input' | 'textarea'>, 'onChange' | 'onBlur'> &
    TextfieldVariantProps

export type NativeTextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement>

export type TextareaAutoSizeStyle = Omit<
  NonNullable<NativeTextareaProps['style']>,
  'maxHeight' | 'minHeight'
> & {
  height?: number
}

type OmittedInputProps =
  | 'isClearButtonFocusVisible'
  | 'isLabelPlaceholder'
  | 'isClearable'
  | 'isTextarea'

export type TextareaHeightChangeMeta = {
  rowHeight: number
}

export interface TextAreaProps
  extends Omit<UseTextfieldProps<HTMLTextAreaElement>, OmittedInputProps> {
  /**
   * Whether the textarea should automatically grow vertically to accomodate content.
   * @default false
   */
  disableAutosize?: boolean
  /**
   * Minimum number of rows to show for textarea
   * @default 3
   */
  minRows?: number
  /**
   * Maximum number of rows up to which the textarea can grow
   * @default 8
   */
  maxRows?: number
  /**
   * Reuse previously computed measurements when computing height of textarea.
   * @default false
   */
  cacheMeasurements?: boolean
  /**
   * Function invoked on textarea height change, with height as first argument.
   * The second function argument is an object containing additional information that
   * might be useful for custom behaviors. Current options include `{ rowHeight: number }`.
   *
   * @param height - The height of the textarea
   * @param meta - Additional information about the height change
   */
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void
}
