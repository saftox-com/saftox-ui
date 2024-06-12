import type { Component } from "solid-js";
import type { LinkProps } from "./link-types";

import { LinkIcon } from "@saftox-ui/shared-icons";
import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { linkAnchorClasses } from "@saftox-ui/theme";
import { Show } from "solid-js";
import { useLink } from "./use-link";

const Link: Component<LinkProps> = (props) => {
	const { Component, local, getLinkProps } = useLink(props);

	return (
		<Dynamic as={Component} {...getLinkProps()}>
			{props.children}
			<Show when={local.showAnchorIcon}>
				<Show
					when={props.anchorIcon}
					fallback={<LinkIcon class={linkAnchorClasses} />}
				>
					{props.anchorIcon}
				</Show>
			</Show>
		</Dynamic>
	);
};

export default Link;
