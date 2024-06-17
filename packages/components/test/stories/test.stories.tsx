import type { Meta, StoryObj } from "@saftox-ui/storybook-solid";
import type { TestProps } from "../src";

import { test } from "@saftox-ui/theme";
import { Test } from "../src";

const meta = {
	title: "Components/Test",
	component: Test,
	argTypes: {
		color: {
			control: { type: "select" },
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
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "full"],
		},
		size: {
			control: { type: "select" },
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
} as Meta<typeof Test>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps = {};

const Template = (args: TestProps) => <Test {...args} />;

export const Default: Story = {
	render: Template,
	args: {
		children: "Test",
		...defaultProps,
	},
};
