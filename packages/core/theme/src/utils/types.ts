import type { ClassValue } from "@saftox-ui/variants";

export type SlotsToClasses<S extends string> = {
	[key in S]?: ClassValue;
};
