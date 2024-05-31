import { mergeProps, splitProps } from "solid-js";
import type { IconSvgProps } from "./types";

export const ArrowLeftIcon = (_props: IconSvgProps) => {
	const [props, otherProps] = splitProps(
		mergeProps({ "stroke-width": 1.5 }, _props),
		["stroke-width"],
	);

	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="1em"
			role="presentation"
			viewBox="0 0 24 24"
			width="1em"
			{...otherProps}
		>
			<path
				d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-miterlimit="10"
				stroke-width={props["stroke-width"]}
			/>
			<path
				d="M20.5 12H3.67004"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-miter-limit="10"
				stroke-width={props["stroke-width"]}
			/>
		</svg>
	);
};
