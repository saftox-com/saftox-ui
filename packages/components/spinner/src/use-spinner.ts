import type { UseSpinnerProps } from "./spinner-types";

import { createMemo, splitProps } from "solid-js";

import { mapPropsVariants } from "@saftox-ui/system-ssc";
import { spinner } from "@saftox-ui/theme";

import { clsx } from "@saftox-ui/shared-utils";
import { combineProps } from "@saftox-ui/solid-utils/reactivity";

export function useSpinner(originalProps: UseSpinnerProps) {
	const [_, variantProps] = mapPropsVariants(
		originalProps,
		spinner.variantKeys,
	);

	const [local, otherProps] = splitProps(originalProps, [
		"class",
		"classes",
		"label",
		"children",
	]);

	const slots = createMemo(() => spinner(variantProps()));

	const label = () => local.label || local.children;

	const ariaLabel = (): string => {
		if (label() && typeof label() === "string") {
			return label() as string;
		}

		return !otherProps["aria-label"] ? "Loading" : "";
	};

	const getSpinnerProps = combineProps(otherProps, {
		get "aria-label"() {
			return ariaLabel();
		},
		class: slots().base({
			class: clsx(local.classes?.base, local.class),
		}),
	});

	return {
		label,
		slots,
		get classes() {
			return local.classes;
		},
		getSpinnerProps,
	};
}

export type UseSpinnerReturn = ReturnType<typeof useSpinner>;
