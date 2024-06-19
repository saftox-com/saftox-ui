import type { Component, JSX } from 'solid-js'

/**
 * All HTML and SVG elements.
 */
export type DOMElements = keyof JSX.IntrinsicElements

/**
 * Represent any HTML element or SolidJS component.
 */
export type ElementType<Props = any> = DOMElements | Component<Props>

/**
 * A map of HTML element names and their interface types.
 * For example `'a'` -> `HTMLAnchorElement`.
 */
export type IntrinsicHTMLElements = {
  [K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends JSX.HTMLAttributes<infer T>
    ? T
    : never
}
