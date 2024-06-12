import { splitProps } from "solid-js";

export const mapPropsVariants = <
	T extends Record<string, any>,
	K extends keyof T,
	R extends [T, Pick<T, K>],
>(
	props: T,
	variantKeys?: K[],
	removeVariantProps = true,
): R => {
	if (!variantKeys) {
		return [props, {} as Pick<T, K>] as R;
	}

	const [picked, omitted] = splitProps(props, variantKeys);

	if (removeVariantProps) {
		return [omitted, picked] as R;
	}

	return [props, picked] as R;
};
