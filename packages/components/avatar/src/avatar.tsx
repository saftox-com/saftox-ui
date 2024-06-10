import type { Component } from "solid-js";
import type { AvatarProps } from "./avatar-types";

import { Show } from "solid-js";

import { useAvatar } from "./use-avatar";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";
import { AvatarIcon } from "./avatar-icon";

const Avatar: Component<AvatarProps> = (props) => {
	const {
		Component,
		ImgComponent,
		reactiveStates,
		src,
		alt,
		icon = <AvatarIcon />,
		name,
		domRef,
		imgRef,
		slots,
		getInitials,
		getAvatarProps,
		getImageProps,
	} = useAvatar(props);

	const fallback = () => {
		if (!reactiveStates.showFlallback && src) {
			return null;
		}

		if (props.fallback) {
			return (
				<div
					aria-label={alt}
					class={slots().fallback({ class: props.classes?.fallback })}
				>
					{props.fallback}
				</div>
			);
		}

		return (
			<>
				<Show
					when={name}
					fallback={
						<span
							aria-label={alt}
							class={slots().icon({ class: props.classes?.icon })}
							role="img"
						>
							{icon}
						</span>
					}
				>
					<span
						aria-label={alt}
						class={slots().name({ class: props.classes?.name })}
						role="img"
					>
						{getInitials(name as string)}
					</span>
				</Show>
			</>
		);
	};

	return (
		<Dynamic as={Component} {...getAvatarProps()}>
			<Show when={src}>
				<Dynamic as={ImgComponent} {...getImageProps()} alt={alt} />
			</Show>
			{fallback()}
		</Dynamic>
	);
};

export default Avatar;
