import type { Component } from "solid-js";
import type { TestProps } from "./test-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { useTest } from "./use-test";

const Test: Component<TestProps> = (props) => {
	const { Component, getTestProps } = useTest(props);

	return (
		<>
			<Dynamic as={Component} {...getTestProps}>
				{props.children}
			</Dynamic>
		</>
	);
};

export default Test;
