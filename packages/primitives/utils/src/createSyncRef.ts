import { type Accessor, createEffect, onCleanup } from "solid-js";

interface ContextValue<T> {
	ref: Accessor<T | undefined>;
}

/**
 * Syncs ref from context with ref passed to primitive.
 */
export function createSyncRef<T>(
	context: ContextValue<T>,
	ref: Accessor<T | undefined>,
) {
	createEffect(() => {
		context.ref = ref;

		onCleanup(() => {
			context.ref = () => undefined;
		});
	});
}
