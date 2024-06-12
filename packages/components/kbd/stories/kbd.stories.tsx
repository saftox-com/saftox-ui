import type { Meta } from "@saftox-ui/storybook-solid";
import type { KbdProps } from "../src";

import { kbd } from "@saftox-ui/theme";
import { Kbd } from "../src";

export default {
	title: "Components/Kbd",
	component: Kbd,
	argTypes: {
		keys: {
			control: {
				type: "select",
			},
			options: [
				"command",
				"shift",
				"ctrl",
				"option",
				"enter",
				"delete",
				"escape",
				"tab",
				"capslock",
				"up",
				"right",
				"down",
				"left",
				"pageup",
				"pagedown",
				"home",
				"end",
				"help",
				"space",
			],
		},
	},
} as Meta<typeof Kbd>;

const Template = (args: KbdProps) => <Kbd {...args} />;

const defaultProps = {
	...kbd.defaultVariants,
	keys: ["command"],
};

export const Default = {
	render: Template,

	args: {
		...defaultProps,
		children: "K",
	},
};
