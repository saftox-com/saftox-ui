import type { Component, ComponentProps, JSX, Ref } from "solid-js";

/**
 * A map of HTML element names and their interface types.
 * For example `'a'` -> `HTMLAnchorElement`.
 */
export type IntrinsicHTMLElements = {
	[K in keyof JSX.IntrinsicElements]: JSX.IntrinsicElements[K] extends JSX.HTMLAttributes<
		infer T
	>
		? T
		: never;
};

/**
 * Represent any HTML element or SolidJS component.
 */
export type ElementType<Props = any> = DOMElements | Component<Props>;

export type As<Props = any> = ElementType<Props>;
export type DOMElements = keyof JSX.IntrinsicElements;
export type CapitalizedDOMElements = Capitalize<DOMElements>;

/** Any focusable element, including both HTML and SVG elements. */
export interface DOMElement extends Element, HTMLOrSVGElement {}

type DataAttributes = {
	[dataAttr: string]: any;
};

/** All DOM attributes supported across both HTML and SVG elements. */
export type DOMAttributes<T = DOMElement> = JSX.HTMLAttributes<T> &
	DataAttributes;

export type OmitCommonProps<
	Target,
	OmitAdditionalProps extends keyof any = never,
> = Omit<Target, "transition" | "as" | "color" | OmitAdditionalProps>;

export type RightJoinProps<
	SourceProps extends object = {},
	OverrideProps extends object = {},
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export type MergeWithAs<
	ComponentProps extends object,
	AsProps extends object,
	AdditionalProps extends object = {},
	AsComponent extends As = As,
> = RightJoinProps<ComponentProps, AdditionalProps> &
	RightJoinProps<AsProps, AdditionalProps> & {
		as?: AsComponent;
	};

/**
 * Extract the props of a Solid element or component
 */
export type PropsOf<T extends As> = ComponentPropsWithoutRef<T> & {
	as?: As;
};

export type Merge<M, N> = N extends Record<string, unknown>
	? M
	: Omit<M, keyof N> & N;

export type HTMLSaftoxUIProps<
	T extends As = "div",
	OmitKeys extends keyof any = never,
> = Omit<
	PropsOf<T>,
	| "ref"
	| "color"
	| "slot"
	| "size"
	| "defaultChecked"
	| "defaultValue"
	| OmitKeys
> & {
	as?: As;
};

export type PropGetter<
	P extends DOMElements | HTMLElement = "div",
	R = P extends DOMElements
		? DOMAttributes<IntrinsicHTMLElements[P]>
		: DOMAttributes<P>,
> = (props?: R, ref?: Ref<any>) => R;

// & {
//   ref?: Ref<P extends DOMElements ? IntrinsicHTMLElements[P] : P>;
// };

// ----

type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<
	ComponentProps<T>
>;

type PropsWithoutRef<P> = P extends any
	? "ref" extends keyof P
		? Omit<P, "ref">
		: P
	: P;
