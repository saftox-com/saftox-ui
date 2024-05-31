import type { JSX } from "solid-js";

/**
 * Call the handler with the event.
 * Simpler way to call a JSX.EventHandlerUnion programmatically.
 */
export function callHandler<T, E extends Event>(
	handler: JSX.EventHandlerUnion<T, E> | undefined,
	event: E & { currentTarget: T; target: Element },
) {
	if (handler) {
		if (typeof handler === "function") {
			handler(event);
		} else {
			handler[0](handler[1], event);
		}
	}

	return event?.defaultPrevented;
}
