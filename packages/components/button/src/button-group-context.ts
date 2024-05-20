import {
	createKeyedContext,
	useKeyedContext,
} from "@saftox-ui/solid-utils/create/keyedContext";
import type { ContextType } from "./button-types";

import { createContext, useContext } from "solid-js";

const ButtonGroupContext = createContext<ContextType>();

export const createButtonGroupContext = (contextId?: string) => {
	if (contextId === undefined) return ButtonGroupContext;

	const context = createKeyedContext<ContextType>(`ButtonGroup-${contextId}`);
	return context;
};

export const useButtonGroupContext = (contextId?: string, strict?: boolean) => {
	const isStrict = !!strict;

	if (contextId === undefined) {
		const context = useContext(ButtonGroupContext);
		if (!context && isStrict) {
			throw new Error(
				"[saftox-ui]: ButtonGroup context not found. Make sure to wrap ButtonGroup components in <ButtonGroup>",
			);
		}
		return context;
	}

	const context = useKeyedContext<ContextType>(`button-group-${contextId}`);
	if (!context && isStrict) {
		throw new Error(
			`[saftox-ui]: ButtonGroup context not found. Make sure to wrap ButtonGroup components in <ButtonGroup>",with id "${contextId}" not found. Make sure to wrap ButtonGroup components in <ButtonGroup contextId="${contextId}">`,
		);
	}
	return context;
};
