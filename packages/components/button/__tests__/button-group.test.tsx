import { render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import { createSignal } from "solid-js";
import { vitest } from "vitest";
import { Button, ButtonGroup } from "../src";

describe("ButtonGroup", () => {
	it("should render correctly", () => {
		const wrapper = render(() => (
			<ButtonGroup>
				<Button>action</Button>
			</ButtonGroup>
		));

		expect(() => wrapper.unmount()).not.toThrow();
	});

	it("ref should be forwarded", () => {
		const [ref, setRef] = createSignal<HTMLDivElement>();

		render(() => <ButtonGroup ref={setRef} />);
		expect(ref()).not.toBeNull();
	});

	it("should ignore events when group disabled", () => {
		const handler = vitest.fn();
		const wrapper = render(() => (
			<ButtonGroup isDisabled={true}>
				<Button data-testid="button-test" onClick={handler}>
					action
				</Button>
			</ButtonGroup>
		));

		const button = wrapper.getByTestId("button-test");

		userEvent.click(button);
		expect(handler).toHaveBeenCalledTimes(0);
	});

	it("should render different variants", () => {
		const wrapper = render(() => (
			<ButtonGroup>
				<Button variant="flat">button</Button>
				<Button color="warning" variant="light">
					light
				</Button>
				<Button color="success" variant="light">
					button
				</Button>
				<Button color="warning" variant="bordered">
					button
				</Button>
			</ButtonGroup>
		));

		expect(() => wrapper.unmount()).not.toThrow();
	});
});
