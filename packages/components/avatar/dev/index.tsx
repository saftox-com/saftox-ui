import { render } from "solid-js/web";
import { Avatar } from "../src";

const App = () => {
	return (
		<>
			<Avatar>
				<span>Hello Solid</span>
			</Avatar>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
