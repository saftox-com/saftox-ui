import type { Meta, StoryObj } from "@saftox-ui/storybook-solid";
import type { ChipProps } from "../src";

import { chip } from "@saftox-ui/theme";
import { Chip } from "../src";

import { Avatar } from "@saftox-ui/avatar";
import { CheckIcon } from "@saftox-ui/shared-icons";

export default {
	title: "Components/Chip",
	component: Chip,
	argTypes: {
		variant: {
			control: {
				type: "select",
			},
			options: ["solid", "bordered", "light", "flat", "faded", "shadow", "dot"],
		},
		color: {
			control: {
				type: "select",
			},
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
		},
		radius: {
			control: {
				type: "select",
			},
			options: ["none", "sm", "md", "lg", "full"],
		},
		size: {
			control: {
				type: "select",
			},
			options: ["sm", "md", "lg"],
		},
		isDisabled: {
			control: {
				type: "boolean",
			},
		},
	},
	parameters: {
		layout: "centered",
	},
} as Meta<typeof Chip>;

type Story = StoryObj<typeof Chip>;

const defaultProps: ChipProps = {
	...chip.defaultVariants,
	children: "Chip",
};

export const Default: Story = {
	args: {
		...defaultProps,
	},
};

export const StartContent: Story = {
	args: {
		...defaultProps,
		startContent: (
			<span aria-label="celebration" class="ml-1" role="img">
				🎉
			</span>
		),
	},
};

export const EndContent: Story = {
	args: {
		...defaultProps,
		endContent: (props) => (
			<span
				aria-label="rocket"
				role="img"
				{...props({
					class: "mr-1",
				})}
			>
				🚀
			</span>
		),
	},
};

export const Closeable: Story = {
	args: {
		...defaultProps,
		onClose: () => console.log("Close"),
	},
};

export const CustomCloseIcon: Story = {
	args: {
		...defaultProps,
		endContent: CheckIcon,
		onClose: () => console.log("Close"),
	},
};

export const WithAvatar: Story = {
	args: {
		...defaultProps,
		variant: "flat",
		color: "secondary",
		avatar: (props) => (
			<Avatar
				name="SZ"
				src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
				{...props}
			/>
		),
	},
};

const HiddenOverflowTemplate = (args: ChipProps) => (
	<div class="w-20 border-danger-500 border-2">
		<Chip {...args} />
	</div>
);

export const HiddenOverflow = {
	render: HiddenOverflowTemplate,
	args: {
		...defaultProps,
		children: "Hello World!",
	},
};
