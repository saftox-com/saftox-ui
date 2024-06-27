import type { FormValidationState } from './create-form-validation-state'
import type { Validation, ValidationResult } from '@saftox-ui/types'

import { createEffect } from 'solid-js'

import { setInteractionModality } from '@saftox-ui/interactions'
import { pickProps } from '@saftox-ui/solid-utils/reactivity'

type ValidatableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface FormValidationProps<T> extends Validation<T> {
  focus?: () => void
}

export function createFormValidation<T>(
  props: FormValidationProps<T>,
  state: FormValidationState,
  ref: ValidatableElement | undefined,
) {
  createEffect(async () => {
    await Promise.resolve()

    if (props.validationBehavior === 'native' && ref) {
      const errorMessage = () =>
        state.realtimeValidation.isInvalid
          ? state.realtimeValidation.validationErrors.join(' ') || 'Invalid value.'
          : ''

      ref.setCustomValidity(errorMessage())

      // Prevent default tooltip for validation message.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=605277
      if (!ref.hasAttribute('title')) {
        ref.title = ''
      }

      if (!state.realtimeValidation.isInvalid) {
        state.updateValidation(getNativeValidity(ref))
      }
    }
  })

  const onReset = state.resetValidation
  const onChange = state.commitValidation
  const onInvalid = (e: Event) => {
    if (!state.displayValidation.isInvalid) {
      state.commitValidation()
    }

    const form = ref?.form
    if (!e.defaultPrevented && ref && form && getFirstInvalidInput(form) === ref) {
      if (focus) {
        focus()
      } else {
        ref?.focus()
      }

      // Always show focus ring.
      setInteractionModality('keyboard')
    }

    // Prevent default browser error UI from appearing.
    e.preventDefault()
  }

  createEffect(() => {
    const input = ref
    if (!input) {
      return
    }

    const form = input.form
    input.addEventListener('invalid', onInvalid)
    input.addEventListener('change', onChange)
    form?.addEventListener('reset', onReset)
    return () => {
      input!.removeEventListener('invalid', onInvalid)
      input!.removeEventListener('change', onChange)
      form?.removeEventListener('reset', onReset)
    }
  })
}

function getValidity(input: ValidatableElement) {
  // The native ValidityState object is live, meaning each property is a getter that returns the current state.
  // We need to create a snapshot of the validity state at the time this function is called to avoid unpredictable React renders.

  return input.validity
}

function getNativeValidity(input: ValidatableElement): ValidationResult {
  return {
    get isInvalid() {
      return !input.validity.valid
    },
    get validationDetails() {
      return getValidity(input)
    },
    get validationErrors() {
      return input.validationMessage ? [input.validationMessage] : []
    },
  }
}

function getFirstInvalidInput(form: HTMLFormElement): ValidatableElement | null {
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i] as ValidatableElement
    if (!element.validity.valid) {
      return element
    }
  }

  return null
}
