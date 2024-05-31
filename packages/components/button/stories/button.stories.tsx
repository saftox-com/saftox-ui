import * as React from "solid-js";

import type { ComponentProps, JSX } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";

import { Camera, HeadphonesIcon, Notification } from "@saftox-ui/shared-icons";
import { button } from "@saftox-ui/theme";
import { createSignal } from "solid-js";

import { Button, type ButtonProps } from "../src";

const meta = {
	title: "Components/Button",
	component: Button,
	argTypes: {
		variant: {
			control: {
				type: "select",
			},
			options: [
				"solid",
				"bordered",
				"glow",
				"light",
				"flat",
				"faded",
				"shadow",
				"ghost",
			],
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
		size: {
			control: {
				type: "select",
			},
			options: ["sm", "md", "lg"],
		},
		spinnerPlacement: {
			control: {
				type: "select",
			},
			options: ["start", "end"],
		},
		fullWidth: {
			control: {
				type: "boolean",
			},
		},
		radius: {
			control: {
				type: "select",
			},
			options: ["none", "sm", "md", "lg", "full"],
		},
		isDisabled: {
			control: {
				type: "boolean",
			},
		},
		isLoading: {
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
} satisfies Meta<ComponentProps<typeof Button>>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps = {
	as: "button",
	children: "Button",
	spinnerPlacement: "start",
	...button.defaultVariants,
};

const StateTemplate = (args: ButtonProps) => {
	const [isOpen, setIsOpen] = createSignal(false);

	const handlePress = () => {
		console.log("Pressed");
		setIsOpen((prev) => !prev);
	};

	return (
		<Button
			{...args}
			aria-label="Open"
			aria-pressed={isOpen()}
			onPress={handlePress}
		>
			{isOpen() ? "Close" : "Open"}
		</Button>
	);
};
const Template = (args) => <Button {...args} />;

export const Default: Story = Template.bind({});
Default.args = {
	...defaultProps,
};

export const WithState: Story = {
	render: StateTemplate,

	args: {
		...defaultProps,
	},
};

export const IsDisabled: Story = {
	args: {
		...defaultProps,
		isDisabled: true,
	},
};

export const WithIcons: Story = {
	args: {
		...defaultProps,
		startContent: <Notification class="fill-current" />,
		endContent: <Camera class="fill-current" />,
	},
};

export const IconButton: Story = {
	args: {
		...defaultProps,
		isIconOnly: true,
		children: (
			<>
				<HeadphonesIcon class="w-5 h-5" />
			</>
		),
	},
};

export const IsLoading: Story = {
	args: {
		...defaultProps,
		color: "primary",
		isLoading: true,
	},
};

export const CustomWithClassNames: Story = {
	args: {
		...defaultProps,
		radius: "full",
		class: "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
	},
};
