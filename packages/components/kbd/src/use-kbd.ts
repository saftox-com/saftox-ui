import type { PropGetter } from "@saftox-ui/system";
import type { UseKbdProps } from "./kbd-types";

import { clsx } from "@saftox-ui/shared-utils";
import { mapPropsVariants } from "@saftox-ui/system";
import { kbd } from "@saftox-ui/theme";
import { createMemo, mergeProps, splitProps } from "solid-js";

export function useKbd(originalProps: UseKbdProps) {
	const [omitVariantProps, variantProps] = mapPropsVariants(
		originalProps,
		kbd.variantKeys,
	);

	const [local, rest] = splitProps(omitVariantProps, [
		"ref",
		"as",
		"class",
		"classes",
		"keys",
		"title",
	]);

	const Component = local.as || "div";

	const slots = createMemo(() => kbd(variantProps));

	const baseStyles = () => clsx(local.classes?.base, local.class);

	const keysToRender = () =>
		typeof local.keys === "string"
			? [local.keys]
			: Array.isArray(local.keys)
				? local.keys
				: [];

	const getKbdProps: PropGetter = (props = {}) =>
		mergeProps(rest, props, {
			ref: local.ref,
			get class() {
				return clsx(slots().base({ class: clsx(baseStyles(), props.class) }));
			},
		});

	return {
		Component,
		slots,
		get title() {
			return local.title;
		},
		keysToRender,
		getKbdProps,
	};
}

export type UseKbdReturn = ReturnType<typeof useKbd>;
