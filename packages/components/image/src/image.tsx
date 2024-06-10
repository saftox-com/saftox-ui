import type { Component } from "solid-js";
import { Show, mergeProps } from "solid-js";

import type { UseImageProps } from "./image-types";
import { useImage } from "./use-image";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";

export interface ImageProps extends UseImageProps {}

const Image: Component<ImageProps> = (props) => {
	const {
		Component,
		reactiveStates,
		removeWrapper,
		disableSkeleton,
		domRef,
		slots,
		getImgProps,
		getWrapperProps,
		getBlurredImgProps,
	} = useImage(props);

	const img = (props: any = {}) => (
		<Dynamic as={Component} {...mergeProps(getImgProps(), props)} />
	);

	if (removeWrapper) {
		return img();
	}

	const zoomed = () => (
		<div
			class={slots().zoomedWrapper({
				class: props.classes?.zoomedWrapper,
			})}
		>
			{img()}
		</div>
	);

	if (reactiveStates.isBlurred) {
		return (
			<div {...getWrapperProps()}>
				<Show when={reactiveStates.isZoomed} fallback={img()}>
					{zoomed()}
				</Show>
				{img(getBlurredImgProps())}
			</div>
		);
	}

	if (reactiveStates.isZoomed || !disableSkeleton || props.fallbackSrc) {
		return (
			<div {...getWrapperProps()}>
				<Show when={reactiveStates.isZoomed} fallback={img()}>
					{zoomed()}
				</Show>
			</div>
		);
	}

	return img();
};

export default Image;
