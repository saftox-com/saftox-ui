import type {
	DOMAttributes,
	HelpTextProps,
	Validation,
} from "@saftox-ui/types";
import type { AriaLabelProps, LabelAria } from "./create-label";

import { combineProps } from "@saftox-ui/solid-utils/reactivity";
import { ID_PREFIX, createSlotId } from "@saftox-ui/utils";

import { createLabel } from "./create-label";

export interface AriaFieldProps
	extends AriaLabelProps,
		HelpTextProps,
		Omit<Validation, "isRequired"> {}

export interface FieldAria extends LabelAria {
	/**
	 * Props for the description element, if any.
	 */
	descriptionProps: DOMAttributes;

	/**
	 * Props for the error message element, if any.
	 */
	errorMessageProps: DOMAttributes;
}

/**
 * Provides the accessibility implementation for input fields.
 * Fields accept user input, gain context from their label, and may display a description or error message.
 * @param props - Props for the Field.
 */
export function createField(props: AriaFieldProps): FieldAria {
	const { labelProps, fieldProps } = createLabel(props);

	const [descriptionId, trackDescIdUse] = createSlotId(ID_PREFIX);
	const [errorMessageId, trackErrorIdUse] = createSlotId(ID_PREFIX);

	const baseFieldProps: DOMAttributes = {
		get "aria-describedby"() {
			return (
				[
					descriptionId(),
					// Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
					// See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
					errorMessageId(),
					props["aria-describedby"],
				]
					.filter(Boolean)
					.join(" ") || undefined
			);
		},
	};

	const descriptionProps: DOMAttributes = {
		get id() {
			trackDescIdUse();
			return descriptionId();
		},
	};

	const errorMessageProps: DOMAttributes = {
		get id() {
			trackErrorIdUse();
			return errorMessageId();
		},
	};

	return {
		labelProps,
		fieldProps: combineProps(fieldProps, baseFieldProps),
		descriptionProps,
		errorMessageProps,
	};
}
