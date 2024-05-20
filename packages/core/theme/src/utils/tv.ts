import type { TV } from "@saftox-ui/variants";
import { tv as tvBase } from "@saftox-ui/variants";

import { twMergeConfig } from "./tw-merge-config";

export const tv: TV = (options, config) =>
	tvBase(options, {
		...config,
		twMerge: config?.twMerge ?? true,
		twMergeConfig: {
			...config?.twMergeConfig,
			theme: {
				...config?.twMergeConfig?.theme,
				...twMergeConfig.theme,
			},
			classGroups: {
				...config?.twMergeConfig?.classGroups,
				...twMergeConfig.classGroups,
			},
		},
	});
