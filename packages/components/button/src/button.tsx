import type { FlowComponent } from "solid-js";

const Button: FlowComponent = (props) => {
	return <div {...props}>{props.children}</div>;
};

export default Button;
