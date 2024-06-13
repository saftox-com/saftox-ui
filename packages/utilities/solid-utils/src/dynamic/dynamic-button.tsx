import type { ValidComponent } from "solid-js";
import type { Ref } from "../dom";
import type { DynamicProps } from "./types";

import { createMemo, createSignal, splitProps } from "solid-js";
import { isButton } from "../assertions";
import { createTagName } from "../create/tag-name";
import { mergeRefs } from "../reactivity";
import { Dynamic } from "./dynamic";

const DEFAULT_DYNAMIC_BUTTON_ELEMENT = "button";

export type DynamicButtonSharedElementProps = {
	ref: Ref;
	type: "button" | "submit" | "reset" | undefined;
};

export type DynamicButtonElementProps = DynamicButtonSharedElementProps & {
	role: "button" | undefined;
};

export type DynamicButtonProps = Partial<DynamicButtonSharedElementProps>;

/** An accessible button that sets `type` and `role` properly based on if it's a native button. */
export const DynamicButton = <
	T extends ValidComponent = typeof DEFAULT_DYNAMIC_BUTTON_ELEMENT,
>(
	props: DynamicProps<T, DynamicButtonProps, DynamicButtonElementProps>,
) => {
	const [ref, setRef] = createSignal<HTMLElement | null>(null);

	const [localProps, otherProps] = splitProps(props, ["ref", "type"]);

	const tagName = createTagName({
		element: ref,
		fallback: DEFAULT_DYNAMIC_BUTTON_ELEMENT,
	});

	const memoizedIsButton = createMemo(() => {
		return isButton(tagName(), localProps.type);
	});

	return (
		<Dynamic<DynamicButtonElementProps>
			// === SharedElementProps ===
			ref={mergeRefs(setRef, localProps.ref)}
			type={memoizedIsButton() ? "button" : undefined}
			// === ElementProps ===
			role={!memoizedIsButton() ? "button" : undefined}
			{...otherProps}
		/>
	);
};
