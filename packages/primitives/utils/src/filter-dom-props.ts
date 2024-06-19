import type { AriaLabelingProps, DOMProps } from '@saftox-ui/types'

import { DOMEventNames, DOMPropNames } from './dom-props'

import { splitProps } from 'solid-js'

interface Options {
  /**
   * If the filter should be enabled.
   */
  enabled?: boolean
  /**
   * If labelling associated aria properties should be included in the filter.
   */
  labelable?: boolean
  /**
   * A Set of other property names that should be included in the filter.
   */
  propNames?: Set<string>
  /**
   * A Set of other property names that should be removed from the filter.
   */
  omitPropNames?: Set<string>
  /**
   * A Set of event names that should be excluded from the filter.
   */
  omitEventNames?: Set<string>
  /**
   * Whether to omit data-* props.
   */
  omitDataProps?: boolean
  /**
   * Whether to omit event props.
   */
  omitEventProps?: boolean
}

const propRe = /^(data-.*)$/
const ariaRe = /^(aria-.*)$/
const funcRe = /^(on[A-Z].*)$/

// Note: "valid DOM props" refers to the `DOMPropNames` Set above, not "any valid DOM props".
/**
 * Filters out all props that aren't valid DOM props or defined via override prop obj.
 * @param props - The component props to be filtered.
 * @param opts - Props to override.
 */
export function filterDOMProps(
  props: Record<string, any> & DOMProps & AriaLabelingProps,
  opts: Options = {},
): DOMProps & AriaLabelingProps {
  const {
    labelable = true,
    enabled = true,
    propNames,
    omitPropNames,
    omitEventNames,
    omitDataProps,
    omitEventProps,
  } = opts
  const filteredPropNames: Array<string> = []

  if (!enabled) {
    return props
  }

  for (const prop in props) {
    if (omitPropNames?.has(prop)) {
      continue
    }

    if (omitEventNames?.has(prop) && funcRe.test(prop)) {
      continue
    }

    if (funcRe.test(prop) && !DOMEventNames.has(prop)) {
      continue
    }

    if (omitDataProps && propRe.test(prop)) {
      continue
    }

    if (omitEventProps && funcRe.test(prop)) {
      continue
    }

    if (
      (Object.prototype.hasOwnProperty.call(props, prop) &&
        (DOMPropNames.has(prop) ||
          (labelable && ariaRe.test(prop)) ||
          propNames?.has(prop) ||
          propRe.test(prop))) ||
      funcRe.test(prop)
    ) {
      filteredPropNames.push(prop)
    }
  }

  const [filteredProps] = splitProps(props, filteredPropNames as any)

  return filteredProps
}
