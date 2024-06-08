import type { ParentComponent } from "solid-js";
import type { IconSvgProps } from "./types";

export const SearchIcon: ParentComponent<IconSvgProps> = (props) => (
	<svg
		aria-hidden="true"
		fill="none"
		height="1em"
		role="presentation"
		viewBox="0 0 512 512"
		width="1em"
		{...props}
	>
		<path
			d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
			fill="none"
			stroke="currentColor"
			stroke-miterlimit="10"
			stroke-width="32"
		/>
		<path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-miterlimit="10"
			stroke-width="32"
			d="M338.29 338.29L448 448"
		/>
		{/* <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    /> */}
	</svg>
);
