import type { RadioGroupState } from './create-radio-group-state'
import type { AriaRadioGroupProps } from './index'
import type { AriaLabelProps } from '@saftox-ui/label'
import type { DOMAttributes, ValidationResult } from '@saftox-ui/types'
import type { Accessor, JSX } from 'solid-js'

import { createMemo, mergeProps } from 'solid-js'

import { getFocusableTreeWalker } from '@saftox-ui/focus'
import { useLocale } from '@saftox-ui/i18n'
import { createFocusWithin } from '@saftox-ui/interactions'
import { createField, createLabel } from '@saftox-ui/label'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'
import { createId, filterDOMProps } from '@saftox-ui/utils'

export interface RadioGroupAria {
  /** Props for the radio group wrapper element. */
  radioGroupProps: DOMAttributes
  /** Props for the radio group's visible label (if any). */
  labelProps: DOMAttributes | JSX.LabelHTMLAttributes<HTMLLabelElement>
  /** Props for the radio group description element, if any. */
  descriptionProps: DOMAttributes
  /** Props for the radio group error message element, if any. */
  errorMessageProps: DOMAttributes
  /**  */
  displayValidation: Accessor<ValidationResult>
}

/**
 * Provides the behavior and accessibility implementation for a radio group component.
 * Radio groups allow users to select a single item from a list of mutually exclusive options.
 * @param props - Props for the radio group.
 * @param state
 */
export function createRadioGroup(
  originalProps: AriaRadioGroupProps,
  state: RadioGroupState,
): RadioGroupAria {
  const defaultGroupName = createId()

  const defaultProps: AriaRadioGroupProps = {
    name: defaultGroupName,
    orientation: 'vertical',
    validationBehavior: 'aria',
  }

  const props = mergeProps(defaultProps, originalProps)

  const locale = useLocale()

  const defaultCreateLabelProps: AriaLabelProps = {
    // Radio group is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false,
  }

  const displayValidation = () => state.displayValidation()

  const createLabelProps = mergeProps(defaultCreateLabelProps, props, {
    get isInvalid() {
      return state.states.isInvalid
    },
    get errorMessage() {
      return props.errorMessage ?? state.displayValidation().validationErrors
    },
  })

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    createField(createLabelProps)

  const domProps = mergeProps(createMemo(() => filterDOMProps(props, { labelable: true })))

  // When the radio group loses focus, reset the focusable radio to null if
  // there is no selection. This allows tabbing into the group from either
  // direction to go to the first or last radio.
  const { focusWithinProps } = createFocusWithin({
    onFocusOut: (e) => {
      props.onBlur?.(e)
      if (!state.states.selectedValue) {
        state.setLastFocusedValue(null)
      }
    },
    // onFocusWithin: props.onFocus,
    onFocusWithinChange: props.onFocusChange,
  })

  // In RTL mode and horizontal orientation, the `left` and `right` keyDown is reversed.
  const onKeyDown = (event: KeyboardEvent) => {
    const isRTLMode = () => locale().direction === 'rtl'
    const isHorizontal = props.orientation !== 'vertical'

    let nextDir: 'prev' | 'next'

    switch (event.key) {
      case 'ArrowRight':
        nextDir = isRTLMode() && isHorizontal ? 'prev' : 'next'
        break
      case 'ArrowLeft':
        nextDir = isRTLMode() && isHorizontal ? 'next' : 'prev'
        break
      case 'ArrowDown':
        nextDir = 'next'
        break
      case 'ArrowUp':
        nextDir = 'prev'
        break
      default:
        return
    }

    event.preventDefault()

    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement

    const walker = getFocusableTreeWalker(currentTarget, {
      from: target,
    })

    let nextElem: Node | null

    if (nextDir === 'next') {
      nextElem = walker.nextNode()

      if (!nextElem) {
        walker.currentNode = currentTarget
        nextElem = walker.firstChild()
      }
    } else {
      nextElem = walker.previousNode()

      if (!nextElem) {
        walker.currentNode = currentTarget
        nextElem = walker.lastChild()
      }
    }

    if (nextElem) {
      // We assume radio group childs is an HTMLElement with a value attribute.
      const element = nextElem as HTMLElement & { value: string }
      // Call focus on nextElem so that keyboard navigation scrolls the radio into view.
      element.focus()
      state.setSelectedValue(element.value)
    }
  }

  const baseGroupProps = mergeProps(
    {
      // https://www.w3.org/TR/wai-aria-1.2/#radiogroup
      role: 'radiogroup',
      onKeyDown,
      get 'aria-invalid'() {
        return state.states.isInvalid || undefined
      },
      get 'aria-errormessage'() {
        return props['aria-errormessage']
      },
      get 'aria-readonly'() {
        return props.isReadOnly || undefined
      },
      get 'aria-required'() {
        return props.isRequired || undefined
      },
      get 'aria-disabled'() {
        return props.isDisabled || undefined
      },
      get 'aria-orientation'() {
        return props.orientation
      },
    } as JSX.HTMLAttributes<any>,
    fieldProps,
    focusWithinProps,
  )

  const radioGroupProps = combineProps(domProps, baseGroupProps)

  return { radioGroupProps, labelProps, descriptionProps, errorMessageProps, displayValidation }
}
