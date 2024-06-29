import type { UseNavbarReturn } from './use-navbar'

import { createContext } from '@saftox-ui/solid-utils/create/create-context'
export const [createNavbarContext, useNavbarContext] = createContext<UseNavbarReturn>({
  name: 'navbar-context',
  strict: false,
})
