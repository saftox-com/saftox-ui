import { render } from "solid-js/web";
import { Divider } from "../src";

const App = () => {
	return (
		<>
			<Divider>
				<span>Hello Solid</span>
			</Divider>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
