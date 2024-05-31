import { mergeProps, splitProps } from "solid-js";
import type { IconSvgProps } from "./types";

export const ChevronUpIcon = (_props: IconSvgProps) => {
	const [props, rest] = splitProps(
		mergeProps({ "stroke-width": 1.5 }, _props),
		["stroke-width"],
	);

	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="1em"
			role="presentation"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width={props["stroke-width"]}
			viewBox="0 0 24 24"
			width="1em"
			{...rest}
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	);
};
