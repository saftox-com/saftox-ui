import type { Component } from "solid-js";
import type { UseDividerProps } from "./use-divider";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { useDivider } from "./use-divider";

export interface DividerProps extends Omit<UseDividerProps, "children"> {}

const Divider: Component<DividerProps> = (props) => {
	const { Component, getDividerProps } = useDivider({ ...props });

	return <Dynamic as={Component} {...getDividerProps()} />;
};

export default Divider;
