import type { Accessor } from "solid-js";
import type { MaybeAccessor, MaybeAccessorValue } from "./types";

const access = <T extends MaybeAccessor<unknown>>(
	v: T,
): MaybeAccessorValue<T> => (typeof v === "function" ? v() : v);

const chain = <Args extends [] | unknown[]>(callbacks: {
	[Symbol.iterator]: () => IterableIterator<
		((...args: Args) => unknown) | undefined
	>;
}): ((...args: Args) => void) => {
	return (...args: Args) => {
		for (const callback of callbacks) callback?.(...args);
	};
};

const mergeRefs = <T>(
	...refs: (T | ((val: T) => void) | undefined)[]
): ((el: T) => void) => {
	return chain(refs as ((el: T) => void)[]);
};

const some = (...signals: Accessor<unknown>[]) => {
	return signals.some((signal) => !!signal());
};

export { access, chain, mergeRefs, some };
