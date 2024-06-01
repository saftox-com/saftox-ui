import type { HelpTextProps, Validation } from "@saftox-ui/types";
import type { JSX } from "solid-js";

import { combineProps } from "@saftox-ui/solid-utils/reactivity";
import { ID_PREFIX, createSlotId } from "@saftox-ui/utils";

import { createLabel } from "./createLabel";
import type { AriaLabelProps, LabelAria } from "./createLabel";

export interface AriaFieldProps
	extends AriaLabelProps,
		HelpTextProps,
		Omit<Validation, "isRequired"> {}

export interface FieldAria extends LabelAria {
	/**
	 * Props for the description element, if any.
	 */
	descriptionProps: JSX.HTMLAttributes<any>;

	/**
	 * Props for the error message element, if any.
	 */
	errorMessageProps: JSX.HTMLAttributes<any>;
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

	const baseFieldProps: JSX.HTMLAttributes<any> = {
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

	const descriptionProps: JSX.HTMLAttributes<any> = {
		get id() {
			trackDescIdUse();
			return descriptionId();
		},
	};

	const errorMessageProps: JSX.HTMLAttributes<any> = {
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
