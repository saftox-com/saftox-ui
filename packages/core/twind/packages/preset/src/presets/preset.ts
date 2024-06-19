import type { Preset } from '@saftox-ui/twind'
import type { ColorScale, ThemeColors } from '../colors'
import type { SaftoxTheme } from '../types/types'

import { themeColorsDark } from '../colors/semantic'

import preflight from './preflight'
import rules from './rules'
import theme from './theme'
import variants from './variants'

export const defaultPreset = (): Preset<SaftoxTheme> => {
  return {
    darkMode: 'class',
    darkColor: (section, key) => {
      const colorPalette = key.split('-')[0] as keyof ThemeColors
      const color = key.split('-')[1] as keyof ColorScale

      if (themeColorsDark[colorPalette]) {
        if (color && themeColorsDark[colorPalette][color]) {
          return themeColorsDark[colorPalette][color]
        }

        return themeColorsDark[colorPalette].DEFAULT
      }
    },
    preflight,
    theme,
    variants,
    rules,
  }
}
