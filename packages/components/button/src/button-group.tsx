import type { Component } from "solid-js";
import type { UseButtonGroupProps } from "./button-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { splitProps } from "solid-js";

import { createButtonGroupContext } from "./button-group-context";
import { useButtonGroup } from "./use-button-group";

export interface ButtonGroupProps extends UseButtonGroupProps {}

const ButtonGroup: Component<ButtonGroupProps> = (props) => {
	const ButtonGroupContext = createButtonGroupContext();

	const [_, otherProps] = splitProps(props, ["children"]);

	const { component, context, classNames, getButtonGroupProps } =
		useButtonGroup(otherProps);

	return (
		<ButtonGroupContext.Provider value={context}>
			<Dynamic as={component} class={classNames()} {...getButtonGroupProps}>
				{props.children}
			</Dynamic>
		</ButtonGroupContext.Provider>
	);
};

export default ButtonGroup;
