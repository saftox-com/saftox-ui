import type { Component } from "solid-js";
import type { UseSkeletonProps } from "./use-skeleton";

import { useSkeleton } from "./use-skeleton";

import { Dynamic } from "@saftox-ui/solid-utils/dynamic";

export interface SkeletonProps extends UseSkeletonProps {}

const Skeleton: Component<SkeletonProps> = (props) => {
	const { Component, getSkeletonProps, getContentProps } = useSkeleton(props);

	return (
		<Dynamic as={Component} {...getSkeletonProps()}>
			<div {...getContentProps()}>{props.children}</div>
		</Dynamic>
	);
};

export default Skeleton;
