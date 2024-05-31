import type { Component } from "solid-js";

import { Show } from "solid-js";
import type { UseSpinnerProps } from "./spinner-types";
import { useSpinner } from "./use-spinner";

export interface SpinnerProps extends UseSpinnerProps {}

const Spinner: Component<SpinnerProps> = (props) => {
	const { slots, classes, label, getSpinnerProps } = useSpinner(props);

	return (
		<div {...getSpinnerProps}>
			<div class={slots().wrapper({ class: classes?.wrapper })}>
				<i class={slots().circle1({ class: classes?.circle1 })} />
				<i class={slots().circle2({ class: classes?.circle2 })} />
			</div>
			<Show when={label()}>
				<span class={slots().label({ class: classes?.label })}>{label()}</span>
			</Show>
		</div>
	);
};

export default Spinner;
