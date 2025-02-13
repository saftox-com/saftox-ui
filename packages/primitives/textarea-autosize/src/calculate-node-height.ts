import type { SizingData } from './get-sizing-data'

import forceHiddenStyles from './force-hidden-styles'

export type CalculatedNodeHeights = [height: number, rowHeight: number]

let hiddenTextarea: HTMLTextAreaElement | null = null

const getHeight = (node: HTMLElement, sizingData: SizingData): number => {
  const height = node.scrollHeight

  if (sizingData.sizingStyle['box-sizing'] === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize
}

export default function calculateNodeHeight(
  sizingData: SizingData,
  value: string,
  minRows = 1,
  maxRows = Number.POSITIVE_INFINITY,
): CalculatedNodeHeights {
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea')
    hiddenTextarea.setAttribute('tabindex', '-1')
    hiddenTextarea.setAttribute('aria-hidden', 'true')
    forceHiddenStyles(hiddenTextarea)
  }

  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea)
  }

  const { paddingSize, borderSize, sizingStyle } = sizingData
  const { 'box-sizing': boxSizing } = sizingStyle

  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(sizingStyle).forEach((_key) => {
    const key = _key as keyof typeof sizingStyle
    // TODO:  style[key as any] is needed since .style follows react's camelCase CSSStyleDeclaration
    hiddenTextarea!.style[key as any] = sizingStyle[key] as any
  })

  forceHiddenStyles(hiddenTextarea)

  hiddenTextarea.value = value
  let height = getHeight(hiddenTextarea, sizingData)

  // measure height of a textarea with a single row
  hiddenTextarea.value = 'x'
  const rowHeight = hiddenTextarea.scrollHeight - paddingSize

  let minHeight = rowHeight * minRows
  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize
  }
  height = Math.max(minHeight, height)

  let maxHeight = rowHeight * maxRows
  if (boxSizing === 'border-box') {
    maxHeight = maxHeight + paddingSize + borderSize
  }
  height = Math.min(maxHeight, height)

  return [height, rowHeight]
}
