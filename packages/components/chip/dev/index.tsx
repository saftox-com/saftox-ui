import { render } from "solid-js/web";
import { Chip } from "../src";

const App = () => {
	return (
		<>
			<Chip>
				<span>Hello Solid</span>
			</Chip>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
