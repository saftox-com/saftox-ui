import { render } from "solid-js/web";
import { Link } from "../src";

const App = () => {
	return (
		<>
			<Link>
				<span>Hello Solid</span>
			</Link>
		</>
	);
};

render(() => <App />, document.getElementById("root")!);
