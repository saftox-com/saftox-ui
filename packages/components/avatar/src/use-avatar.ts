import type { PropGetter } from "@saftox-ui/system";
import type { UseAvatarProps } from "./avatar-types";

import { createSignal, mergeProps, splitProps } from "solid-js";

import { createFocusRing } from "@saftox-ui/focus";
import { createHover } from "@saftox-ui/interactions";
import { clsx, dataAttr, safeText } from "@saftox-ui/shared-utils";
import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";
import { useProviderContext } from "@saftox-ui/system";
import { avatar } from "@saftox-ui/theme";
import { useImage } from "@saftox-ui/use-image";
import { filterDOMProps } from "@saftox-ui/utils";
import { useAvatarGroupContext } from "./avatar-group-context";

export function useAvatar(originalProps: UseAvatarProps = {}) {
	const globalContext = useProviderContext();
	const groupContext = useAvatarGroupContext();

	const defaultProps: UseAvatarProps = {
		alt: "avatar",
		color: "default",
		radius: "full",
		size: "md",
		isBordered: false,
		isDisabled: false,
		isFocusable: false,
		getInitials: safeText,
		ignoreFallback: false,
		showFallback: false,
		ImgComponent: "img",
	};

	const props = mergeProps(originalProps, defaultProps, groupContext);

	const [local, rest] = splitProps(props, [
		"as",
		"ref",
		"src",
		"name",
		"icon",
		"class",
		"classes",
		"fallback",
		"alt",
		"imgRef",
		"color",
		"radius",
		"size",
		"isBordered",
		"isDisabled",
		"isFocusable",
		"getInitials",
		"ignoreFallback",
		"showFallback",
		"ImgComponent",
		"imgProps",
		"onError",
	]);

	const [variantProps, _] = splitProps(props, [
		"color",
		"radius",
		"size",
		"isBordered",
		"isDisabled",
		"disableAnimation",
	]);

	const Component = local.as || "span";
	const shouldFilterDOMProps = typeof local.ImgComponent === "string";

	const [domRef, setDomRef] = createSignal<HTMLSpanElement>();
	const [imgRef, setImgRef] = createSignal<HTMLImageElement>();

	const { isFocusVisible, isFocused, focusProps } = createFocusRing();
	const { isHovered, hoverProps } = createHover();

	const { isReady } = useImage(
		{
			src: local.src,
		},
		{ onError: local.onError },
	);

	const reactiveStates = {
		get disableAnimation() {
			return (
				originalProps.disableAnimation ??
				globalContext?.disableAnimation ??
				false
			);
		},
		get isImgLoaded() {
			return isReady();
		},
		get showFlallback() {
			return (!local.src || !this.isImgLoaded) && local.showFallback;
		},
		get baseStyles() {
			return clsx(local.classes?.base, local.class);
		},
		get canBeFocused() {
			return local.isFocusable || local.as === "button";
		},
	};

	const slots = () => {
		return avatar(
			combineProps(variantProps, {
				get isInGroup() {
					return !!groupContext;
				},
				get isInGridGroup() {
					return !!groupContext?.isGrid || false;
				},
			}),
		);
	};

	const getAvatarProps: PropGetter = (props = {}) => {
		return mergeProps(
			reactiveStates.canBeFocused ? focusProps : {},
			hoverProps,
			rest,
			{
				ref: mergeRefs(local.ref, setDomRef),
				get tabIndex() {
					return reactiveStates.canBeFocused ? 0 : -1;
				},
				get "data-hover"() {
					return dataAttr(isHovered);
				},
				get "data-focus"() {
					return dataAttr(isFocusVisible);
				},
				get "data-focus-visible"() {
					return dataAttr(isFocusVisible);
				},
				get class() {
					return slots().base({
						class: clsx(reactiveStates.baseStyles, props?.class),
					});
				},
			},
		);
	};

	const getImageProps: PropGetter = (props = {}) => {
		return mergeProps(
			{
				ref: mergeRefs(local.imgRef, setImgRef),
				src: local.src,
				get "data-loaded"() {
					return dataAttr(reactiveStates.isImgLoaded);
				},
				get class() {
					return slots().img({
						class: clsx(local.classes?.img),
					});
				},
			},
			filterDOMProps(
				{
					get disableAnimation() {
						return reactiveStates.disableAnimation;
					},
				},
				{
					enabled: shouldFilterDOMProps,
				},
			),
			local.imgProps,
			props,
		);
	};

	return {
		Component,
		reactiveStates,
		get ImgComponent() {
			return local.ImgComponent;
		},
		get src() {
			return local.src;
		},
		get alt() {
			return local.alt;
		},
		get icon() {
			return local.icon;
		},
		get name() {
			return local.name;
		},
		get getInitials() {
			return local.getInitials;
		},
		domRef,
		imgRef,
		slots,
		getAvatarProps,
		getImageProps,
	};
}

export type UseAvatarReturn = ReturnType<typeof useAvatar>;
