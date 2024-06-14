import { render } from "solid-js/web";
import { Snippet } from "../src";

const App = () => {
	return (
		<>
			<Snippet>
				<span>Hello Solid</span>
			</Snippet>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
