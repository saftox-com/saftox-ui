import { render } from "solid-js/web";
import { Test } from "../src";

const App = () => {
	return (
		<>
			<Test>
				<span>Hello Solid</span>
			</Test>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
