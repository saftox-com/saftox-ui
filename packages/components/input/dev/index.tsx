import { render } from "solid-js/web";
import { Input } from "../src";

const App = () => {
	return (
		<>
			<Input>
				<span>Hello Solid</span>
			</Input>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
