import type {
	Arrayable,
	Fn,
	MaybeAccessor,
	MaybeElement,
} from "@saftox-ui/shared-hooks/utils";

import { defaultWindow } from "@saftox-ui/shared-hooks";
import { toAccessor } from "@saftox-ui/shared-hooks/to-accessor";
import { tryOnCleanup } from "@saftox-ui/shared-hooks/try-on-cleanup";
import { noop } from "@saftox-ui/shared-hooks/utils";
import { watch } from "@saftox-ui/shared-hooks/watch";

interface InferEventTarget<Events> {
	addEventListener: (event: Events, fn?: any, options?: any) => any;
	removeEventListener: (event: Events, fn?: any, options?: any) => any;
}

export type WindowEventName = keyof WindowEventMap;
export type DocumentEventName = keyof DocumentEventMap;

export type GeneralEventListener<E = Event> = (evt: E) => void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 */
export function useEventListener<E extends keyof WindowEventMap>(
	event: Arrayable<E>,
	listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
	options?: MaybeAccessor<boolean | AddEventListenerOptions>,
): Fn;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 */
export function useEventListener<E extends keyof WindowEventMap>(
	target: Window,
	event: Arrayable<E>,
	listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
	options?: MaybeAccessor<boolean | AddEventListenerOptions>,
): Fn;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 */
export function useEventListener<E extends keyof DocumentEventMap>(
	target: DocumentOrShadowRoot,
	event: Arrayable<E>,
	listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
	options?: MaybeAccessor<boolean | AddEventListenerOptions>,
): Fn;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Explicitly HTMLElement target
 *
 */
export function useEventListener<E extends keyof HTMLElementEventMap>(
	target: MaybeAccessor<HTMLElement | null | undefined>,
	event: Arrayable<E>,
	listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => any,
	options?: boolean | AddEventListenerOptions,
): () => void;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target with event type infer
 *
 */
export function useEventListener<Names extends string, EventType = Event>(
	target: InferEventTarget<Names>,
	event: Arrayable<Names>,
	listener: Arrayable<GeneralEventListener<EventType>>,
	options?: MaybeAccessor<boolean | AddEventListenerOptions>,
): Fn;

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 6: Custom event target fallback
 *
 */
export function useEventListener<EventType = Event>(
	target: MaybeAccessor<EventTarget | null | undefined>,
	event: Arrayable<string>,
	listener: Arrayable<GeneralEventListener<EventType>>,
	options?: MaybeAccessor<boolean | AddEventListenerOptions>,
): Fn;

export function useEventListener(...args: any[]) {
	let target: MaybeAccessor<EventTarget> | undefined;
	let events: Arrayable<string>;
	let listeners: Arrayable<Function>;
	let options: MaybeAccessor<boolean | AddEventListenerOptions> | undefined;

	if (typeof args[0] === "string" || Array.isArray(args[0])) {
		[events, listeners, options] = args;
		target = defaultWindow;
	} else {
		[target, events, listeners, options] = args;
	}

	if (!target) return noop;

	if (!Array.isArray(events)) events = [events];
	if (!Array.isArray(listeners)) listeners = [listeners];

	const cleanups: Function[] = [];
	const cleanup = () => {
		for (const fn of cleanups) {
			fn();
		}
		cleanups.length = 0;
	};

	const register = (el: any, event: string, listener: any, options: any) => {
		el.addEventListener(event, listener, options);

		return () => el.removeEventListener(event, listener, options);
	};

	const stopWatch = watch(
		[toAccessor(target as unknown as MaybeElement), toAccessor(options)],
		([el, options]) => {
			cleanup();
			if (!el) return;

			cleanups.push(
				...(events as string[]).flatMap((event) => {
					return (listeners as Function[]).map((listener) =>
						register(el, event, listener, options),
					);
				}),
			);
		},
	);

	const stop = () => {
		stopWatch();
		cleanup();
	};

	tryOnCleanup(stop);

	return stop;
}
