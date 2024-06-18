import type { LongPressEvent, PressEvent } from "@saftox-ui/types";
import type { MaybeAccessor } from "@solid-primitives/utils";
import type { JSX } from "solid-js";

import { mergeProps } from "solid-js";

import { createDescription, createGlobalListeners } from "@saftox-ui/utils";

import { combineProps } from "@solid-primitives/props";
import { access } from "@solid-primitives/utils";

import { createPress } from "./create-press";

interface CreateLongPressProps {
	/**
	 * Whether long press events should be disabled.
	 */
	isDisabled?: MaybeAccessor<boolean | undefined>;

	/**
	 * The amount of time in milliseconds to wait before triggering a long press.
	 * @default 500ms
	 */
	threshold?: MaybeAccessor<number | undefined>;
	/**
	 * A description for assistive techology users indicating that a long press
	 * action is available, e.g. "Long press to open menu".
	 */
	accessibilityDescription?: MaybeAccessor<string | undefined>;

	/**
	 * Handler that is called when a long press interaction starts.
	 */
	onLongPressStart?: (e: LongPressEvent) => void;

	/**
	 * Handler that is called when a long press interaction ends, either
	 * over the target or when the pointer leaves the target.
	 */
	onLongPressEnd?: (e: LongPressEvent) => void;

	/**
	 * Handler that is called when the threshold time is met while
	 * the press is over the target.
	 */
	onLongPress?: (e: LongPressEvent) => void;
}

export interface LongPressResult<T extends HTMLElement> {
	/**
	 * Props to spread on the target element.
	 */
	longPressProps: JSX.HTMLAttributes<T>;
}

const DEFAULT_THRESHOLD = 500;

/**
 * Handles long press interactions across mouse and touch devices. Supports a customizable time threshold,
 * accessibility description, and normalizes behavior across browsers and devices.
 */
export function createLongPress<T extends HTMLElement>(
	originalProps: CreateLongPressProps,
): LongPressResult<T> {
	const defaultProps: CreateLongPressProps = {
		threshold: DEFAULT_THRESHOLD,
	};

	const props = mergeProps(defaultProps, originalProps);

	let timeoutId: number | undefined;

	const { addGlobalListener, removeGlobalListener } = createGlobalListeners();

	const isDisabled = () => access(props.isDisabled) ?? false;

	const onPressStart = (e: PressEvent) => {
		if (e.pointerType === "mouse" || e.pointerType === "touch") {
			props.onLongPressStart?.({
				...e,
				type: "longpressstart",
			});

			timeoutId = window.setTimeout(() => {
				// Prevent other usePress handlers from also handling this event.
				e.target.dispatchEvent(
					new PointerEvent("pointercancel", { bubbles: true }),
				);

				props.onLongPress?.({
					...e,
					type: "longpress",
				});

				timeoutId = undefined;
			}, access(props.threshold) ?? DEFAULT_THRESHOLD);

			// Prevent context menu, which may be opened on long press on touch devices
			if (e.pointerType === "touch") {
				const onContextMenu = (e: Event) => {
					e.preventDefault();
				};

				addGlobalListener(e.target, "contextmenu", onContextMenu, {
					once: true,
				});
				addGlobalListener(
					window,
					"pointerup",
					() => {
						// If no contextmenu event is fired quickly after pointerup, remove the handler
						// so future context menu events outside a long press are not prevented.
						setTimeout(() => {
							removeGlobalListener(e.target, "contextmenu", onContextMenu);
						}, 30);
					},
					{ once: true },
				);
			}
		}
	};

	const onPressEnd = (e: PressEvent) => {
		if (timeoutId) {
			window.clearTimeout(timeoutId);
		}

		if (e.pointerType === "mouse" || e.pointerType === "touch") {
			props.onLongPressEnd?.({
				...e,
				type: "longpressend",
			});
		}
	};

	const { pressProps } = createPress({ isDisabled, onPressStart, onPressEnd });

	const description = () => {
		return props.onLongPress && !isDisabled()
			? access(props.accessibilityDescription)
			: undefined;
	};

	const descriptionProps = createDescription(description);

	const longPressProps = combineProps(
		pressProps,
		descriptionProps,
	) as JSX.HTMLAttributes<T>;

	return { longPressProps };
}
