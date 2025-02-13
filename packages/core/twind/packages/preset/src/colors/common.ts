import { blue } from './blue'
import { cyan } from './cyan'
import { green } from './green'
import { pink } from './pink'
import { purple } from './purple'
import { red } from './red'
import { slate } from './slate'
import { yellow } from './yellow'
import { zinc } from './zinc'

export const commonColors = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',

  white: '#ffffff',
  black: '#000000',
  slate,
  blue,
  green,
  pink,
  purple,
  red,
  yellow,
  cyan,
  zinc,
}

export type CommonColors = typeof commonColors
