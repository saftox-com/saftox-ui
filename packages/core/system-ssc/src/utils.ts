import type { Accessor } from "solid-js";
import { mergeProps } from "solid-js";

export const mapPropsVariants = <
	T extends Record<string, any>,
	K extends keyof T,
	R extends [Accessor<Omit<T, K> | T>, Accessor<Pick<T, K> | {}>],
>(
	props: T,
	variantKeys?: K[],
	removeVariantProps = true,
): R => {
	if (!variantKeys) {
		return [props, {}] as unknown as R;
	}

	const picked = () =>
		variantKeys.reduce((acc, key) => {
			if (key in props) {
				return mergeProps(acc, { [key]: props[key] });
			}
			return acc;
		}, {});

	if (removeVariantProps) {
		const omitted = () =>
			Object.keys(props)
				.filter((key) => !variantKeys.includes(key as K))
				.reduce(
					(acc, key) => mergeProps(acc, { [key]: props[key as keyof T] }),
					{},
				);

		return [omitted, picked] as R;
	}

	return [props, picked] as unknown as R;
};
