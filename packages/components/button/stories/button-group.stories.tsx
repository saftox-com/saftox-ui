import * as React from "solid-js"; // for type checking

import type { Component, ComponentProps } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";

import { button, buttonGroup } from "@saftox-ui/theme";

import type { ButtonGroupProps } from "../src";
import { Button, ButtonGroup } from "../src";

export default {
	title: "Components/ButtonGroup",
	component: ButtonGroup,
	argTypes: {
		variant: {
			control: {
				type: "select",
			},
			options: ["solid", "bordered", "light", "flat", "shadow", "ghost"],
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
		fullWidth: {
			control: {
				type: "boolean",
			},
		},
		isDisabled: {
			control: {
				type: "boolean",
			},
		},
		disableAnimation: {
			control: {
				type: "boolean",
			},
		},
	},
} satisfies Meta<ComponentProps<typeof ButtonGroup>>;

const defaultProps = {
	...button.defaultVariants,
	...buttonGroup.defaultVariants,
};

const Template = (args: ButtonGroupProps) => (
	<ButtonGroup {...args}>
		<Button>One</Button>
		<Button>Two</Button>
		<Button>Three</Button>
	</ButtonGroup>
);

const VariantButtonTemplate = (args: ButtonGroupProps) => (
	<ButtonGroup {...args}>
		<Button>One</Button>
		<Button>Two</Button>
		<Button>Three</Button>
		<Button variant="bordered">Four</Button>
		<Button>Five</Button>
		<Button>Six</Button>
	</ButtonGroup>
);

const VariantButtonsTemplate = (args: ButtonGroupProps) => (
	<ButtonGroup {...args}>
		<Button color="success" variant="bordered">
			One
		</Button>
		<Button color="success">Two</Button>
		<Button variant="bordered">Three</Button>
		<Button variant="bordered">Four</Button>
		<Button variant="bordered">Five</Button>
		<Button variant="bordered">Six</Button>
	</ButtonGroup>
);

export const Default = {
	render: Template,

	args: {
		...defaultProps,
	},
};

export const VariantButton = {
	render: VariantButtonTemplate,

	args: {
		...defaultProps,
		variant: "solid",
	},
};

export const VariantButtons = {
	render: VariantButtonsTemplate,

	args: {
		...defaultProps,
		variant: "solid",
	},
};
