import { doubleEntryConfig } from "../../../configs/tsup.config";

export default doubleEntryConfig({
	entries: [
		{
			entry: "src/index.ts",
		},
	],
});
