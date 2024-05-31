import * as React from "solid-js";

import type { ComponentProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";

import { Spinner } from "../src";

import { spinner } from "@saftox-ui/theme";

const meta = {
	title: "Components/Spinner",
	component: Spinner,
	argTypes: {
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
		labelColor: {
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
		size: {
			control: {
				type: "select",
			},
			options: ["sm", "md", "lg"],
		},
	},
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div class="ml-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<ComponentProps<any>>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps = {
	...spinner.defaultVariants,
};

// const Template = (args: any) => <Spinner {...args} />;

export const Default = {
	args: {
		...defaultProps,
	},
};

export const WithLabel = {
	args: {
		...defaultProps,
		label: "Loading...",
	},
};
