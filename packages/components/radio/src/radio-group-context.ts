import type { ContextType } from './radio-types'

import { createContext } from '@saftox-ui/solid-utils/create/create-context'

export const [createRadioGroupContext, useRadioGroupContext] = createContext<ContextType>({
  name: 'radio-group-context',
  strict: true,
})
