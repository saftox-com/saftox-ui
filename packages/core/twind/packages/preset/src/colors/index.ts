import { commonColors } from './common'
import { themeColorsLight } from './semantic'

export * from './types'

const colors = {
  ...commonColors,
  ...themeColorsLight,
}

export { colors, commonColors }
