import { dataFocusVisibleClasses } from "../utils";
import { tv } from "../utils/tv";

/**
 * User wrapper **Variants** component
 *
 * const {base, wrapper, name, description} = user({...})
 *
 * @example
 * <div classes={base())}>
 *   // avatar element @see avatar
 *  <div classes={wrapper())}>
 *    <span classes={name())}>user name</span>
 *    <span classes={description())}>user description</span>
 *  </div>
 * </div>
 */
const user = tv({
	slots: {
		base: [
			"inline-flex items-center justify-center gap-2 rounded-small outline-none",
			// focus ring
			...dataFocusVisibleClasses,
		],
		wrapper: "inline-flex flex-col items-start",
		name: "text-small text-inherit",
		description: "text-tiny text-foreground-400",
	},
});

export type UserSlots = keyof ReturnType<typeof user>;

export { user };
