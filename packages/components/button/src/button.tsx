import type { Component } from "solid-js";
import type { UseButtonProps } from "./button-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { Show } from "solid-js";

import { useButton } from "./use-button";

import { GlowEffect } from "./glow-effect";

export interface ButtonProps extends UseButtonProps {}

const Button: Component<ButtonProps> = (props) => {
	const {
		component,
		domRef,
		endContent,
		getButtonProps,
		isIconOnly,
		isLoading,
		isDisabled,
		slots,
		spinnerPlacement,
		startContent,
		spinner,
	} = useButton(props);

	return (
		<Dynamic as={component} {...getButtonProps()}>
			<Show when={props.variant === "glow" && !isLoading() && !isDisabled()}>
				<GlowEffect ref={domRef} color={props.color} radius={props.radius} />
			</Show>

			<div class={slots().innerWrapper()}>
				<Show when={startContent}>{startContent}</Show>

				<Show when={isLoading() && spinnerPlacement() === "start"}>
					{spinner()}
				</Show>

				<Show when={isLoading() && isIconOnly} fallback={props.children}>
					{null}
				</Show>

				<Show when={isLoading() && spinnerPlacement() === "end"}>
					{spinner()}
				</Show>

				<Show when={endContent}>{endContent}</Show>
			</div>
		</Dynamic>
	);
};

export default Button;
