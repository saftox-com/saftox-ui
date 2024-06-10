import { render } from "solid-js/web";
import { Image } from "../src";

const App = () => {
	return (
		<>
			<Image>
				<span>Hello Solid</span>
			</Image>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
