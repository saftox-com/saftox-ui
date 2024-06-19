/**
 * Scrolls `scrollView` so that `element` is visible.
 * Similar to `element.scrollIntoView({block: 'nearest'})` (not supported in Edge),
 * but doesn't affect parents above `scrollView`.
 */
export function scrollIntoView(scrollView: HTMLElement, element: HTMLElement) {
  const offsetX = relativeOffset(scrollView, element, 'left')
  const offsetY = relativeOffset(scrollView, element, 'top')

  const width = element.offsetWidth
  const height = element.offsetHeight

  let x = scrollView.scrollLeft
  let y = scrollView.scrollTop

  const maxX = x + scrollView.offsetWidth
  const maxY = y + scrollView.offsetHeight

  if (offsetX <= x) {
    x = offsetX
  } else if (offsetX + width > maxX) {
    x += offsetX + width - maxX
  }

  if (offsetY <= y) {
    y = offsetY
  } else if (offsetY + height > maxY) {
    y += offsetY + height - maxY
  }

  scrollView.scrollLeft = x
  scrollView.scrollTop = y
}

/**
 * Computes the offset (left or top) from a child element to an ancestor element.
 * It accumulates offsetLeft or offsetTop through intervening offsetParents.
 */
function relativeOffset(ancestor: HTMLElement, child: HTMLElement, axis: 'left' | 'top'): number {
  const offsetProperty = axis === 'left' ? 'offsetLeft' : 'offsetTop'
  let totalOffset = 0
  let currentElement = child

  while (currentElement) {
    totalOffset += currentElement[offsetProperty]

    // If the current element is the ancestor, stop the loop.
    if (currentElement === ancestor) {
      break
    }

    // Move to the next offsetParent.
    currentElement = currentElement.offsetParent as HTMLElement

    // If there's no offsetParent, and we haven't reached the ancestor, reset totalOffset.
    if (!currentElement) {
      totalOffset = 0
      break
    }
  }

  return totalOffset
}
