import type { FlowComponent } from "solid-js";

const Input: FlowComponent = (props) => {
	return <div {...props}>{props.children}</div>;
};

export default Input;
