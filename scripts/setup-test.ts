import '@testing-library/jest-dom'
import { vitest } from 'vitest'

const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: vitest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vitest.fn(), // Deprecated
      removeListener: vitest.fn(), // Deprecated
      addEventListener: vitest.fn(),
      removeEventListener: vitest.fn(),
      dispatchEvent: vitest.fn(),
    })),
  })
}

// Workaround https://github.com/jsdom/jsdom/issues/2524#issuecomment-897707183
global.TextEncoder = require('node:util').TextEncoder

global.ResizeObserver = vitest.fn().mockImplementation(() => ({
  observe: vitest.fn(),
  unobserve: vitest.fn(),
  disconnect: vitest.fn(),
}))
