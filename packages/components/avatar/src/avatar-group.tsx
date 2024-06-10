import type { Component } from "solid-js";
import type { AvatarGroupProps } from "./avatar-group-types";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { For, Show, mergeProps, splitProps } from "solid-js";
import { createAvatarGroupContext } from "./avatar-group-context";
import { useAvatarGroup } from "./use-avatar-group";

import Avatar from "./avatar";

const AvatarGroup: Component<AvatarGroupProps> = (originalProps) => {
	const AvatarGroupContext = createAvatarGroupContext();

	const defaultProps = {
		renderCount: (count: number | undefined) => (
			<Avatar {...getAvatarGroupCountProps()} name={`+${count}`} />
		),
	};

	const props = mergeProps(originalProps, defaultProps);

	const [local, others] = splitProps(props, ["children", "renderCount"]);

	const {
		Component,
		context,
		clones,
		remainingCount,
		getAvatarGroupProps,
		getAvatarGroupCountProps,
	} = useAvatarGroup(others);

	return (
		<Dynamic as={Component} {...getAvatarGroupProps()}>
			<AvatarGroupContext.Provider value={context}>
				<>
					<For each={clones(local.children)}>
						{(child, index) => {
							return child;
						}}
					</For>
					<Show when={remainingCount()}>
						{local.renderCount(remainingCount())}
					</Show>
				</>
			</AvatarGroupContext.Provider>
		</Dynamic>
	);
};

export default AvatarGroup;
