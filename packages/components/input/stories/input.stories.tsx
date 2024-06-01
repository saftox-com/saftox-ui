import * as React from "solid-js"; // for type checking

import type { ComponentProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";

import { Input } from "../src";

const meta = {
	title: "Components/Input",
	component: Input,
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
} satisfies Meta<ComponentProps<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps = {};

const Template = (args: any) => <Input {...args} />;

export const Default: Story = {
	render: Template,
	args: {
		children: "Input",
		...defaultProps,
	},
};
