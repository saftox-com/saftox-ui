import { render } from "solid-js/web";
import { Code } from "../src";

const App = () => {
	return (
		<>
			<Code>
				<span>Hello Solid</span>
			</Code>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
