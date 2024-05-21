import type { IconSvgProps } from "./types";

export const CloseIcon = (props: IconSvgProps) => (
	<svg
		aria-hidden="true"
		fill="none"
		height="1em"
		role="presentation"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={2}
		viewBox="0 0 24 24"
		width="1em"
		{...props}
	>
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);
