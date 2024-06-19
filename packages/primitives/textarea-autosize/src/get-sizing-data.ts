import type { JSX } from 'solid-js/jsx-runtime'
import { pick } from './utils'

const SIZING_STYLE = [
  'border-bottom-width',
  'border-left-width',
  'border-right-width',
  'border-top-width',
  'box-sizing',
  'font-family',
  'font-size',
  'font-style',
  'font-zeight',
  'letter-spacing',
  'line-height',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  // non-standard
  'tab-size',
  'text-indent',
  // non-standard
  'text-rendering',
  'text-transform',
  'width',
  'word-break',
] as const

// TODO:  solid afaik does not have an equivalent to CSSStyleDeclaration
//        replace this line once there is a proper solid equivalent
type CSSStyleDeclarationSolid = {
  [Property in keyof JSX.CSSProperties]: string
}

type SizingProps = Extract<(typeof SIZING_STYLE)[number], keyof CSSStyleDeclarationSolid>

type SizingStyle = Pick<CSSStyleDeclarationSolid, SizingProps>

export type SizingData = {
  sizingStyle: SizingStyle
  paddingSize: number
  borderSize: number
}

const isIE =
  typeof document !== 'undefined' ? !!(document.documentElement as any).currentStyle : false

const getSizingData = (node: HTMLElement): SizingData | null => {
  const style = window.getComputedStyle(node) as unknown as CSSStyleDeclarationSolid

  if (!style) {
    return null
  }

  const sizingStyle = pick(SIZING_STYLE as unknown as SizingProps[], style)
  const { 'box-sizing': boxSizing } = sizingStyle

  // probably node is detached from DOM, can't read computed dimensions
  if (!boxSizing) {
    return null
  }

  // IE (Edge has already correct behaviour) returns content width as computed width
  // so we need to add manually padding and border widths
  if (isIE && boxSizing === 'border-box') {
    sizingStyle.width = `${
      Number.parseFloat(sizingStyle.width!) +
      Number.parseFloat(sizingStyle['border-right-width']!) +
      Number.parseFloat(sizingStyle['border-left-width']!) +
      Number.parseFloat(sizingStyle['padding-right']!) +
      Number.parseFloat(sizingStyle['padding-left']!)
    }px`
  }

  const paddingSize =
    Number.parseFloat(sizingStyle['padding-bottom']!) +
    Number.parseFloat(sizingStyle['padding-top']!)

  const borderSize =
    Number.parseFloat(sizingStyle['border-bottom-width']!) +
    Number.parseFloat(sizingStyle['border-top-width']!)

  return {
    sizingStyle,
    paddingSize,
    borderSize,
  }
}

export default getSizingData
