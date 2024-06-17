import type { PropGetter } from "@saftox-ui/system";
import type { UseTestProps } from "./test-types";

import { clsx } from "@saftox-ui/shared-utils";
import { mapPropsVariants, useProviderContext } from "@saftox-ui/system";
import { button } from "@saftox-ui/theme";
import {
	createEffect,
	createMemo,
	createSignal,
	mergeProps,
	splitProps,
} from "solid-js";

export function useTest(originalProps: UseTestProps) {
	const globalContext = useProviderContext();

	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		button.variantKeys,
	);

	const defaultProps = {};

	const props = mergeProps(defaultProps, omitVariantProps);

	const [local, rest] = splitProps(props, ["ref", "as", "class", "classes"]);

	const Component = local.as || "div";

	const classes = createMemo(() =>
		button(
			mergeProps(variantProps, {
				get class() {
					return local.class;
				},
			}),
		),
	);

	const getTestProps = (props = {}) => {
		console.log(props);

		return mergeProps(
			{
				"data-slot": "test",
				// color: variantProps.color,
			},
			local,
			props,
		);
	};

	// createEffect(() => {
	// 	console.log(classes());
	// });

	return {
		Component,
		getTestProps,
	};
}

export type UseTestReturn = ReturnType<typeof useTest>;
