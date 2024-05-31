import type { Accessor } from "solid-js";

import { combineProps } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";
import { access, chain } from "@solid-primitives/utils";

const some = (...signals: Accessor<unknown>[]) => {
	return signals.some((signal) => !!signal());
};

export { access, chain, mergeRefs, some, combineProps };
