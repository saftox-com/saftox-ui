import type { Component } from "solid-js";
import type { UseButtonProps } from "./button-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { Show } from "solid-js";

import { useButton } from "./use-button";

export interface ButtonProps extends UseButtonProps {}

const Button: Component<ButtonProps> = (props) => {
	const {
		component,
		styles,
		startContent,
		endContent,
		isLoading,
		isIconOnly,
		spinnerPlacement,
		getButtonProps,
	} = useButton(props);

	return (
		<Dynamic component={component} class={styles()} {...getButtonProps()}>
			<Show when={startContent}>{startContent}</Show>
			{isLoading() && props.isIconOnly ? null : props.children}
			<Show when={endContent}>{endContent}</Show>
		</Dynamic>
	);
};

export default Button;
