import type { NumberFormatOptions } from '@internationalized/number'
import type { Accessor } from 'solid-js'

import { NumberFormatter } from '@internationalized/number'
import { createMemo } from 'solid-js'

import { useLocale } from './context'

/**
 * Provides localized number formatting for the current locale. Automatically updates when the locale changes,
 * and handles caching of the number formatter for performance.
 * @param options - Formatting options.
 */
export function createNumberFormatter(
  options: Accessor<NumberFormatOptions>,
): Accessor<Intl.NumberFormat> {
  const locale = useLocale()

  const formatter = createMemo(() => new NumberFormatter(locale().locale, options()))

  return formatter
}
