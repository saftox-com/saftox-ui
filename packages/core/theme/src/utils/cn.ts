import type { Class } from "@saftox-ui/twind";

import { cx } from "@saftox-ui/twind";
import { extendTailwindMerge } from "tailwind-merge";

import { twMergeConfig } from "./tw-merge-config";

/**
 * We need to extend the tailwind merge to include SaftoxUI custom classes.
 *
 * So we can use classes like `text-small` or `text-default-500` and override them.
 */
const twMerge = extendTailwindMerge(twMergeConfig);

export function cn(...inputs: Class[]): string {
	return twMerge(cx(inputs));
}
