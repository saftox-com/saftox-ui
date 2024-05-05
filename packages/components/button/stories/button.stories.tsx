import * as React from "solid-js";

import type { ComponentProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";

import { Button } from "../src";

const meta = {
	title: "Components/Button",
	component: Button,
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

const Template = (args: any) => <Button {...args} />;

export const Default: Story = {
	render: Template,
	args: {
		children: Button,
		...defaultProps,
	},
};