import type { CheckboxGroupState } from './create-checkbox-group-state'
import type { DOMAttributes } from '@saftox-ui/types'
import type {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  FocusEvents,
  HelpTextProps,
  InputBase,
  LabelableProps,
  Validation,
  ValidationResult,
  ValueBase,
} from '@saftox-ui/types'
import type { JSX } from 'solid-js'

import { createCheckboxGroupState } from './create-checkbox-group-state'

import { createMemo, mergeProps } from 'solid-js'

import { createFocusWithin } from '@saftox-ui/interactions'
import { createField } from '@saftox-ui/label'
import { combineProps, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { filterDOMProps } from '@saftox-ui/utils'

export interface CheckboxGroupProps
  extends ValueBase<string[]>,
    InputBase,
    LabelableProps,
    HelpTextProps,
    Validation<string[]> {}

export interface AriaCheckboxGroupProps
  extends CheckboxGroupProps,
    DOMProps,
    AriaLabelingProps,
    AriaValidationProps,
    FocusEvents {
  /** The Checkboxes contained within the CheckboxGroup. */
  children?: JSX.Element
  /** The name of the CheckboxGroup, used when submitting an HTML form.*/
  name?: string
}

interface CheckboxGroupAria extends ValidationResult {
  /** Props for the checkbox group wrapper element. */
  groupProps: DOMAttributes
  /** Props for the checkbox group's visible label (if any). */
  labelProps: DOMAttributes | JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props for the checkbox group description element, if any. */
  descriptionProps: DOMAttributes
  /** Props for the checkbox group error message element, if any. */
  errorMessageProps: DOMAttributes
}

/**
 * Provides the behavior and accessibility implementation for a checkbox group component.
 * Checkbox groups allow users to select multiple items from a list of options.
 * @param props - Props for the checkbox group.
 */
export function createCheckboxGroup(
  props: AriaCheckboxGroupProps,
  state: CheckboxGroupState,
): CheckboxGroupAria {
  const displayValidationState = pickProps(state.displayValidation, [
    'isInvalid',
    'validationErrors',
    'validationDetails',
  ])

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField(
    mergeProps(props, {
      isHTMLLabelElement: true,
      get isInvalid() {
        return state.isInvalid()
      },
    }),
  )

  const domProps = mergeProps(createMemo(() => filterDOMProps(props, { labelable: true })))

  const { focusWithinProps } = createFocusWithin({
    get onFocusIn() {
      return props.onBlur
    },
    get onFocusOut() {
      return props.onFocus
    },
    get onFocusWithinChange() {
      return props.onFocusChange
    },
  })

  const groupProps = mergeProps(
    domProps,
    {
      role: 'group',
      get 'aria-disabled'() {
        return props.isDisabled || undefined
      },
    } as JSX.HTMLAttributes<any>,
    fieldProps,
    focusWithinProps,
  )

  return combineProps(
    {
      groupProps,
      labelProps,
      descriptionProps,
      errorMessageProps,
    },
    displayValidationState,
  )
}
