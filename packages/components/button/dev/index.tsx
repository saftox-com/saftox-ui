import { render } from "solid-js/web";
import { Button } from "../src";

const App = () => {
	return (
		<>
			<Button>
				<span>Hello Solid</span>
			</Button>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
