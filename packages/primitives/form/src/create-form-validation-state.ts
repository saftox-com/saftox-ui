import type {
  Validation,
  ValidationErrors,
  ValidationFunction,
  ValidationResult,
} from '@saftox-ui/types'

import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from 'solid-js'

import { pickProps } from '@saftox-ui/solid-utils/reactivity'

export const VALID_VALIDITY_STATE = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valueMissing: false,
  valid: true,
}

const CUSTOM_VALIDITY_STATE = {
  ...VALID_VALIDITY_STATE,
  customError: true,
  valid: false,
}

export const DEFAULT_VALIDATION_RESULT = {
  isInvalid: false,
  validationDetails: VALID_VALIDITY_STATE,
  validationErrors: [],
}

export const FormValidationContext = createContext<ValidationErrors>({})
export const privateValidationStateProp: `__formValidationState${string}` = `__formValidationState${Date.now()}`

interface FormValidationProps<T> extends Validation<T> {
  builtinValidation?: ValidationResult
  name?: string | string[]
  value?: T
  [key: `__formValidationState${string}`]: FormValidationState
}

export interface FormValidationState {
  /** Realtime validation results, updated as the user edits the value. */
  realtimeValidation(): ValidationResult
  /** Currently displayed validation results, updated when the user commits their changes. */
  displayValidation(): ValidationResult
  /** Updates the current validation result. Not displayed to the user until `commitValidation` is called. */
  updateValidation(result: ValidationResult): void
  /** Resets the displayed validation state to valid when the user resets the form. */
  resetValidation(): void
  /** Commits the realtime validation so it is displayed to the user. */
  commitValidation(): void
}

export function createFormValidationState<T>(props: FormValidationProps<T>): FormValidationState {
  const privateValidationStates = props?.[privateValidationStateProp]

  if (privateValidationStates) {
    const pickPrivateProps: FormValidationState = pickProps(privateValidationStates, [
      'realtimeValidation',
      'displayValidation',
      'updateValidation',
      'resetValidation',
      'commitValidation',
    ])

    return pickPrivateProps
  }

  return createFormValidationStateImpl(props)
}

function createFormValidationStateImpl<T>(
  originalProps: FormValidationProps<T>,
): FormValidationState {
  const defaultProps = {
    validationBehavior: 'aria',
  }

  const props = mergeProps(defaultProps, originalProps)

  const [local, rest] = splitProps(props, [
    'isInvalid',
    'validationState',
    'name',
    'value',
    'builtinValidation',
    'validate',
    'validationBehavior',
  ])

  const [isInvalid, setIsInvalid] = createSignal(local.isInvalid)
  const [builtinValidation, setBuiltinValidation] = createSignal(local.builtinValidation)

  // backward compatibility.
  if (local.validationState) {
    setIsInvalid(local.validationState === 'invalid')
  }

  const controlledError = (): ValidationResult | null => {
    if (isInvalid() !== undefined)
      ({
        get isInvalid() {
          return isInvalid()
        },
        validationErrors: [],
        validationDetails: CUSTOM_VALIDITY_STATE,
      })

    return null
  }

  const clientError = (): ValidationResult | null => {
    if (!local.validate || !local.value) {
      return null
    }

    return getValidationResult(runValidate(local.validate, local.value))
  }

  if (builtinValidation()?.validationDetails.valid) {
    setBuiltinValidation(undefined)
  }

  // Get relevant server errors from the form.
  const serverErrors = useContext(FormValidationContext)
  const serverErrorMessages = (): string[] => {
    if (local.name) {
      return Array.isArray(local.name)
        ? local.name.flatMap((name) => asArray(serverErrors[name]))
        : asArray(serverErrors[local.name])
    }

    return []
  }

  const [lastServerError, setLastServerError] = createSignal(serverErrors)
  const [isServerErrorCleared, setServerErrorCleared] = createSignal<boolean>(false)

  if (serverErrors !== lastServerError()) {
    setLastServerError(serverErrors)
    setServerErrorCleared(false)
  }

  const serverError = () => {
    return getValidationResult(isServerErrorCleared() ? [] : serverErrorMessages())
  }

  const [currentValidity, setCurrentValidity] =
    createSignal<ValidationResult>(DEFAULT_VALIDATION_RESULT)
  let nextValidation: ValidationResult = DEFAULT_VALIDATION_RESULT
  let lastError: ValidationResult = DEFAULT_VALIDATION_RESULT

  const commitValidation = () => {
    if (!commitQueued()) {
      return
    }

    setCommitQueued(false)
    const error = () => clientError() || builtinValidation()

    if (!isEqualValidation(error() as any, lastError)) {
      lastError = error() as any
      setCurrentValidity(error() as any)
    }
  }

  const [commitQueued, setCommitQueued] = createSignal(false)

  createEffect(commitValidation)

  return {
    realtimeValidation: () => {
      return (
        controlledError() ||
        serverError() ||
        clientError() ||
        builtinValidation() ||
        DEFAULT_VALIDATION_RESULT
      )
    },
    displayValidation: () => {
      return local.validationBehavior === 'native'
        ? controlledError() || serverError() || currentValidity()
        : controlledError() ||
            serverError() ||
            clientError() ||
            builtinValidation() ||
            currentValidity()
    },
    updateValidation: (value) => {
      // If validationBehavior is 'aria', update in realtime. Otherwise, store in a ref until commit.
      if (local.validationBehavior === 'aria' && !isEqualValidation(currentValidity(), value)) {
        setCurrentValidity(value)
      } else {
        nextValidation = value
      }
    },
    resetValidation() {
      // Update the currently displayed validation state to valid on form reset,
      // even if the native validity says it isn't. It'll show again on the next form submit.
      const error = DEFAULT_VALIDATION_RESULT
      if (!isEqualValidation(error, lastError)) {
        lastError = error
        setCurrentValidity(error)
      }

      // Do not commit validation after the next render. This avoids a condition where
      // useSelect calls commitValidation inside an onReset handler.
      if (local.validationBehavior === 'native') {
        setCommitQueued(false)
      }

      setServerErrorCleared(true)
    },
    commitValidation() {
      // Commit validation state so the user sees it on blur/change/submit. Also clear any server errors.
      // Wait until after the next render to commit so that the latest value has been validated.
      if (local.validationBehavior === 'native') {
        setCommitQueued(true)
      }
      setServerErrorCleared(true)
    },
  }
}

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }
  return Array.isArray(value) ? value : [value]
}

function runValidate<T>(validate: ValidationFunction<T>, value: T): string[] {
  if (typeof validate === 'function' && value) {
    const e = validate(value)

    if (e && typeof e !== 'boolean') {
      return asArray(e)
    }
  }

  return []
}

function getValidationResult(errors: string[]): ValidationResult | null {
  return errors?.length
    ? {
        isInvalid: true,
        validationErrors: errors,
        validationDetails: CUSTOM_VALIDITY_STATE,
      }
    : null
}

function isEqualValidation(a: ValidationResult, b: ValidationResult): boolean {
  if (a === b) return true
  if (!a || !b) return false

  const errorsEqual = () =>
    a.validationErrors.length === b.validationErrors.length &&
    a.validationErrors.every((error, i) => error === b.validationErrors[i])

  const detailsEqual = () =>
    Object.keys(a.validationDetails).every(
      (key) => (a.validationDetails as any)[key] === (b.validationDetails as any)[key],
    )

  return a.isInvalid === b.isInvalid && errorsEqual() && detailsEqual()
}

export function mergeValidation(...results: ValidationResult[]): ValidationResult {
  const errors = new Set<string>()
  let isInvalid = false
  const validationDetails = {
    ...VALID_VALIDITY_STATE,
  }

  for (const v of results) {
    for (const e of v.validationErrors) {
      errors.add(e)
    }

    // Only these properties apply for checkboxes.
    isInvalid ||= v.isInvalid
    for (const key in validationDetails) {
      ;(validationDetails as any)[key] ||= (v.validationDetails as any)[key]
    }
  }

  validationDetails.valid = !isInvalid
  return {
    isInvalid,
    validationErrors: [...errors],
    validationDetails,
  }
}
