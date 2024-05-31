import type { ContextType } from "./button-types";

import { createContext } from "@saftox-ui/solid-utils/create/create-context";

export const [createButtonGroupContext, useButtonGroupContext] =
	createContext<ContextType>({
		name: "button-group",
		strict: false,
	});
