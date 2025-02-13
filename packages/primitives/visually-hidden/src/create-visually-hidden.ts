import type { MaybeAccessor } from '@saftox-ui/solid-utils/reactivity'
import type { JSX } from 'solid-js'

import { createSignal, mergeProps } from 'solid-js'

import { createFocus } from '@saftox-ui/interactions'
import { access, isObject } from '@saftox-ui/solid-utils/reactivity'

interface AriaVisuallyHiddenProps {
  /**
   * Whether the element should become visible on focus, for example skip links.
   */
  isFocusable?: MaybeAccessor<boolean | undefined>

  /**
   * Additional style to be passed to the element.
   */
  style?: MaybeAccessor<JSX.CSSProperties | string | undefined>
}

interface VisuallyHiddenAria {
  /**
   * Props to spread onto the target element.
   */
  visuallyHiddenProps: JSX.HTMLAttributes<any>
}

const visuallyHiddenStyles: JSX.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  'clip-path': 'inset(50%)',
  height: '1',
  margin: '0 -1px -1px 0',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1',
  'white-space': 'nowrap',
}

/**
 * Provides props for an element that hides its children visually
 * but keeps content visible to assistive technology.
 */
export function createVisuallyHidden(props: AriaVisuallyHiddenProps = {}): VisuallyHiddenAria {
  const [isFocused, setFocused] = createSignal(false)

  const { focusProps } = createFocus({
    isDisabled: () => !access(props.isFocusable),
    onFocusChange: setFocused,
  })

  // If focused, don't hide the element.
  const combinedStyles = () => {
    const style = access(props.style)

    if (isFocused()) {
      return style
    }

    if (isObject(style)) {
      return { ...visuallyHiddenStyles, ...style }
    }

    return visuallyHiddenStyles
  }

  const visuallyHiddenProps = mergeProps(focusProps, {
    get style() {
      return combinedStyles()
    },
  } as JSX.HTMLAttributes<any>)

  return { visuallyHiddenProps }
}
