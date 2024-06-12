import { Activity, Camera } from "@saftox-ui/shared-icons";
import type { Meta } from "@saftox-ui/storybook-solid";
import { avatar } from "@saftox-ui/theme";

import { Avatar } from "../src";

export default {
	title: "Components/Avatar",
	component: Avatar,
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
	},
	decorators: [
		(Story: any) => (
			<div class="flex items-center justify-center w-screen h-screen">
				<Story />
			</div>
		),
	],
} as Meta<typeof Avatar>;

const defaultProps = {
	...avatar.defaultVariants,
};

export const Default = {
	args: {
		...defaultProps,
	},
};

export const WithText = {
	args: {
		...defaultProps,
		name: "SZ",
		color: "danger",
	},
};

export const IsDisabled = {
	args: {
		...defaultProps,
		src: "https://i.pravatar.cc/300?u=a042581f4e29026709d",
		color: "secondary",
		isBordered: true,
		isDisabled: true,
	},
};

export const WithImage = {
	args: {
		...defaultProps,
		src: "https://i.pravatar.cc/300?u=a042581f4e29026705d",
	},
};

export const isBordered = {
	args: {
		...defaultProps,
		src: "https://i.pravatar.cc/300?u=a042581f4e29026709d",
		color: "secondary",
		isBordered: true,
	},
};

export const isFocusable = {
	args: {
		...defaultProps,
		src: "https://i.pravatar.cc/300?u=a042581f4e29026707d",
		isFocusable: true,
	},
};

export const WithIcon = {
	args: {
		...defaultProps,
		size: "lg",
	},
};

export const Custom = {
	args: {
		...defaultProps,
		icon: <Activity fill="currentColor" size={20} />,
		radius: "xl",
		classes: {
			base: "shadow-lg bg-cyan-200 dark:bg-cyan-800",
		},
	},
};

export const CustomSize = {
	args: {
		...defaultProps,
		classes: {
			base: "w-32 h-32 text-base",
		},
	},
};

export const CustomSizeImg = {
	args: {
		...defaultProps,
		src: "https://i.pravatar.cc/300?u=a042581f4e29026705d",
		name: "Serhii",
		classes: {
			base: "w-32 h-32 text-base",
		},
	},
};

export const DefaultIcon = {
	args: {
		...defaultProps,
		classes: {
			icon: "text-default-400",
		},
	},
};

export const IconFallback = {
	args: {
		...defaultProps,
		src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
		showFallback: true,
	},
};

export const InitialsFallback = {
	args: {
		...defaultProps,
		src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
		name: "Serhii",
		showFallback: true,
	},
};

export const CustomFallback = {
	args: {
		...defaultProps,
		src: "https://images.unsplash.com/broken",
		showFallback: true,
		fallback: (
			<Camera
				class="animate-pulse w-6 h-6 text-default-500"
				fill="currentColor"
				size={20}
			/>
		),
	},
};

export const BrokenImage = {
	args: {
		...defaultProps,
		src: "https://images.unsplash.com/broken-image",
		name: "Serhii",
		showFallback: true,
	},
};
