import type { RadioGroupState } from './create-radio-group-state'

interface RadioGroupData {
  name: string
  descriptionId: string | undefined
  errorMessageId: string | undefined
  validationBehavior: 'aria' | 'native'
}

export const radioGroupData = new WeakMap<RadioGroupState, RadioGroupData>()
