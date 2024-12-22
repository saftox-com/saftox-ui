import type { ContextType } from './checkbox-types'

import { createContext } from '@saftox-ui/solid-utils/create/create-context'
export const [createCheckboxGroupContext, useCheckboxGroupContext] = createContext<ContextType>({
  name: 'checkbox-group-context',
  strict: false,
})
