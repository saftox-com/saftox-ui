import type { SSRElement } from './assertions'
import type { Axis, Side, Size } from './types'

import {
  dataIf,
  isBrowserElement,
  isButton,
  isElement,
  isFunction,
  isSSRElement,
} from './assertions'

export type { Axis, Side, Size, SSRElement }

export { isFunction, isButton, dataIf, isSSRElement, isBrowserElement, isElement }
