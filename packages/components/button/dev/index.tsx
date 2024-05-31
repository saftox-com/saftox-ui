import { render } from "solid-js/web";
import { Button } from "../src";

const App = () => {
	return <Button>Hello Solid</Button>;
};

render(() => <App />, document.getElementById("root")!);
