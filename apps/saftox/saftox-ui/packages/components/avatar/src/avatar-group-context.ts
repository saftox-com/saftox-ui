import type { ContextType } from './avatar-types'

import { createContext } from '@saftox-ui/solid-utils/create/create-context'

export const [createAvatarGroupContext, useAvatarGroupContext] = createContext<ContextType>({
  name: 'avatar-group-context',
  strict: false,
})
