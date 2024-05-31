import { doubleEntryConfig } from "../../../configs/tsup.config";

export default doubleEntryConfig({
	entries: [
		{
			name: "index",
			entry: "src/index.ts",
		},
		{
			name: "create/*",
			entry: "src/create/*",
		},
		{
			name: "dom",
			entry: "src/dom/index.ts",
		},
		{
			name: "dynamic",
			entry: "src/dynamic/index.ts",
		},
		{
			name: "reactivity",
			entry: "src/reactivity/index.ts",
		},
	],
});
