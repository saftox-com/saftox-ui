import type { JSX } from 'solid-js'

/**
 * A set of common DOM props that are allowed on any component
 * Ensure this is synced with DOMPropNames in utils/filterDOMProps.
 */
export interface DOMProps {
  /**
   * The element's unique identifier.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
   */
  id?: string
}

export interface TextInputDOMEvents {
  // Clipboard events
  /**
   * Handler that is called when the user copies text.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/oncopy).
   */
  onCopy?: JSX.EventHandlerUnion<HTMLInputElement, ClipboardEvent>

  /**
   * Handler that is called when the user cuts text.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/oncut).
   */
  onCut?: JSX.EventHandlerUnion<HTMLInputElement, ClipboardEvent>

  /**
   * Handler that is called when the user pastes text.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/onpaste).
   */
  onPaste?: JSX.EventHandlerUnion<HTMLInputElement, ClipboardEvent>

  // Composition events
  /**
   * Handler that is called when a text composition system starts a new text composition session.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event).
   */
  onCompositionStart?: JSX.EventHandlerUnion<HTMLInputElement, CompositionEvent>

  /**
   * Handler that is called when a text composition system completes or cancels the current text composition session.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event).
   */
  onCompositionEnd?: JSX.EventHandlerUnion<HTMLInputElement, CompositionEvent>

  /**
   * Handler that is called when a new character is received in the current text composition session.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event).
   */
  onCompositionUpdate?: JSX.EventHandlerUnion<HTMLInputElement, CompositionEvent>

  // Selection events
  /**
   * Handler that is called when text in the input is selected.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/select_event).
   */
  onSelect?: JSX.EventHandlerUnion<HTMLInputElement, Event>

  // Input events
  /**
   * Handler that is called when the input value is about to be modified.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event).
   */
  onBeforeInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>

  /**
   * Handler that is called when the input value is modified.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event).
   */
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>
}

/**
 * DOM props that apply to all text inputs.
 * Ensure this is synced with useTextField
 */
export interface TextInputDOMProps extends DOMProps, TextInputDOMEvents {
  /**
   * Describes the type of autocomplete functionality the input should provide if any.
   *  See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autocomplete?: string

  /**
   * The maximum number of characters supported by the input.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefmaxlength).
   */
  maxLength?: number

  /**
   * The minimum number of characters required by the input.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefminlength).
   */
  minLength?: number

  /**
   * The name of the input element, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string

  /**
   * Regex pattern that the value of the input must match to be valid.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefpattern).
   */
  pattern?: string

  /**
   * Content that appears in the input when it is empty.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefplaceholder).
   */
  placeholder?: string

  /**
   * The type of input to render.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdeftype).
   */
  type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password' | string

  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents.
   * See [MDN](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute).
   */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
}

/** Any focusable element, including both HTML and SVG elements. */
export interface FocusableElement extends Element, HTMLOrSVGElement {}

type DataAttributes = {
  [dataAttr: string]: any
}

/** All DOM attributes supported across both HTML and SVG elements. */
export type DOMAttributes<T = FocusableElement> = JSX.HTMLAttributes<T> & DataAttributes
