import type { Component } from "solid-js";
import type { UseButtonGroupProps } from "./button-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { Show, splitProps } from "solid-js";

import { createButtonGroupContext } from "./button-group-context";
import { useButtonGroup } from "./use-button-group";

import { GlowEffect } from "./glow-effect";

export interface ButtonGroupProps extends UseButtonGroupProps {}

const ButtonGroup: Component<ButtonGroupProps> = (props) => {
	const ButtonGroupContext = createButtonGroupContext();

	const [_, otherProps] = splitProps(props, ["children"]);

	const { component, domRef, context, slots, getButtonGroupProps } =
		useButtonGroup(otherProps);

	return (
		<ButtonGroupContext.Provider value={context}>
			<Dynamic as={component} class={slots().base()} {...getButtonGroupProps}>
				<Show when={props.variant === "glow"}>
					<GlowEffect ref={domRef} color={props.color} radius={props.radius} />
				</Show>
				<div class={slots().innerWrapper()}>{props.children}</div>
			</Dynamic>
		</ButtonGroupContext.Provider>
	);
};

export default ButtonGroup;
