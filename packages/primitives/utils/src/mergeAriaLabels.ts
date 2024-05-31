import type { AriaLabelingProps, DOMProps } from "@saftox-ui/types";
import type { MaybeAccessor } from "@solid-primitives/utils";

import { access } from "@solid-primitives/utils";

import { createId } from "./createId";

export interface MergeAriaLabelsProps {
	/**
	 * The element's unique identifier.
	 * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).
	 */
	id?: MaybeAccessor<string | undefined>;

	/**
	 * Defines a string value that labels the current element.
	 */
	"aria-label"?: MaybeAccessor<string | undefined>;

	/**
	 * Identifies the element (or elements) that labels the current element.
	 */
	"aria-labelledby"?: MaybeAccessor<string | undefined>;
}

export interface AriaLabelsResult {
	/**
	 * Props to apply to the field container element being labeled.
	 */
	ariaLabelsProps: DOMProps & AriaLabelingProps;
}

/**
 * Merges aria-label and aria-labelledby into aria-labelledby when both exist.
 * @param props - Aria label props.
 * @param defaultAriaLabel - Default value for aria-label when not present.
 */
export function mergeAriaLabels(
	props: MergeAriaLabelsProps,
	defaultAriaLabel?: MaybeAccessor<string | undefined>,
): AriaLabelsResult {
	const defaultId = createId();

	const id = () => access(props.id) ?? defaultId;

	const ariaLabelledby = () => {
		const label = access(props["aria-label"]);
		let labelledBy = access(props["aria-labelledby"]);

		// If there is both an aria-label and aria-labelledby,
		// combine them by pointing to the element itself.
		// ex: `<input id="foo" aria-label="Email" aria-labelledby="foo" />`
		if (labelledBy && label) {
			const ids = new Set([...labelledBy.trim().split(/\s+/), id()]);
			labelledBy = [...ids].join(" ");
		} else if (labelledBy) {
			labelledBy = labelledBy.trim().split(/\s+/).join(" ");
		}

		return labelledBy;
	};

	const ariaLabel = () => {
		const defaultLabel = access(defaultAriaLabel);
		let label = access(props["aria-label"]);

		// If no labels are provided, use the default
		if (!label && !ariaLabelledby() && defaultLabel) {
			label = defaultLabel;
		}

		return label;
	};

	const ariaLabelsProps: DOMProps & AriaLabelingProps = {
		get id() {
			return id();
		},
		get "aria-labelledby"() {
			return ariaLabelledby();
		},
		get "aria-label"() {
			return ariaLabel();
		},
	};

	return { ariaLabelsProps };
}
