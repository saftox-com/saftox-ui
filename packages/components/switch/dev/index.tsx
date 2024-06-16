import { render } from "solid-js/web";
import { Switch } from "../src";

const App = () => {
	return (
		<>
			<Switch>
				<span>Hello Solid</span>
			</Switch>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
