import type { Component } from "solid-js";
import type { UserProps } from "./user-types";

import { Avatar } from "@saftox-ui/avatar";
import { useUser } from "./use-user";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";

const User: Component<UserProps> = (props) => {
	const { Component, slots, avatarProps, getUserProps } = useUser(props);

	return (
		<Dynamic as={Component} {...getUserProps()}>
			<Avatar {...avatarProps} />
			<div class={slots().wrapper({ class: props.classes?.wrapper })}>
				<span class={slots().name({ class: props.classes?.name })}>
					{props.name}
				</span>
				<span
					class={slots().description({ class: props.classes?.description })}
				>
					{props.description}
				</span>
			</div>
		</Dynamic>
	);
};

export default User;
