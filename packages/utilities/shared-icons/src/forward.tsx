import type { IconSvgProps } from "./types";

export const ForwardIcon = (props: IconSvgProps) => (
	<svg
		aria-hidden="true"
		fill="none"
		height="1em"
		role="presentation"
		shape-rendering="geometricPrecision"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
		viewBox="0 0 24 24"
		width="1em"
		{...props}
	>
		<path d="M13 17l5-5-5-5" />
		<path d="M6 17l5-5-5-5" />
	</svg>
);
