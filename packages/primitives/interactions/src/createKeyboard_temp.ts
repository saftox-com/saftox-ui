import type { KeyboardEvents } from "@saftox-ui/types";
import type { MaybeAccessor } from "@solid-primitives/utils";

import { access } from "@solid-primitives/utils";

export interface CreateKeyboardProps extends KeyboardEvents {
	/**
	 * Whether the keyboard events should be disabled.
	 */
	isDisabled?: MaybeAccessor<boolean | undefined>;
}

type KeyboardProps = Required<Pick<KeyboardEvents, "onKeyDown" | "onKeyUp">>;

export interface KeyboardResult {
	/**
	 * Props to spread onto the target element.
	 */
	keyboardProps: KeyboardProps;
}

/**
 * Handles keyboard events for the target.
 */
export function createKeyboard(props: CreateKeyboardProps): KeyboardResult {
	const isDisabled = () => access(props.isDisabled) ?? false;

	const onKeyDown: CreateKeyboardProps["onKeyDown"] = (event) => {
		if (isDisabled()) {
			return;
		}

		props.onKeyDown?.(event);
	};

	const onKeyUp: CreateKeyboardProps["onKeyUp"] = (event) => {
		if (isDisabled()) {
			return;
		}

		props.onKeyUp?.(event);
	};

	const keyboardProps: KeyboardProps = {
		onKeyDown,
		onKeyUp,
	};

	return { keyboardProps };
}
