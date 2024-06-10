import type { PropGetter } from "@saftox-ui/system";
import type { UseImageProps } from "./image-types";

import { clsx, dataAttr } from "@saftox-ui/shared-utils";
import { useProviderContext } from "@saftox-ui/system";
import { mapPropsVariants } from "@saftox-ui/system";
import { image } from "@saftox-ui/theme";
import { useImage as useImageBase } from "@saftox-ui/use-image";
import { createSignal, mergeProps, splitProps } from "solid-js";

import { combineProps, mergeRefs } from "@saftox-ui/solid-utils/reactivity";

export function useImage(originalProps: UseImageProps) {
	const globalContext = useProviderContext();

	const [props, variantProps] = mapPropsVariants(
		originalProps,
		image.variantKeys,
	);

	const defaultProps = {
		get disableSkeleton() {
			return !!originalProps.fallbackSrc;
		},
		removeWrapper: false,
	};

	const propsWithDefault = mergeProps(defaultProps, props);

	const [local, rest] = splitProps(propsWithDefault, [
		"ref",
		"as",
		"src",
		"class",
		"classes",
		"loading",
		"fallbackSrc",
		"isBlurred",
		"isLoading",
		"disableSkeleton",
		"removeWrapper",
		"onError",
		"onSuccess",
		"onLoad",
		"srcSet",
		"sizes",
		"crossorigin",
		"crossOrigin",
	]);

	const Component = local.as || "img";

	const imageStatus = useImageBase(
		{
			src: local.src,
			loading: local.loading,
			srcset: local.srcSet,
			sizes: local.sizes,
			crossorigin: local.crossorigin ?? local.crossOrigin,
		},
		{
			onError: local.onError,
			onSuccess: local.onSuccess,
		},
	);

	const reactiveStates = {
		get isDisableAnimation() {
			return (
				originalProps.disableAnimation ??
				globalContext.disableAnimation ??
				false
			);
		},
		get isImgLoaded() {
			return imageStatus.isReady() && !local.isLoading;
		},
		get isLoading() {
			return imageStatus.isLoading() || local.isLoading;
		},
		get isBlurred() {
			return local.isBlurred;
		},
		get isZoomed() {
			return originalProps.isZoomed;
		},
		get showFallback() {
			return (!local.src || !this.isImgLoaded) && !!local.fallbackSrc;
		},
		get showSkeleton() {
			return this.isLoading && !local.disableSkeleton;
		},
		get width() {
			return {
				get w() {
					return originalProps.width
						? typeof originalProps.width === "number"
							? `${originalProps.width}px`
							: originalProps.width
						: "auto";
				},
			};
		},
		get baseStyles() {
			return clsx(local.class, local.classes?.img);
		},
	};

	const [domRef, setDomRef] = createSignal<HTMLImageElement>();

	const slots = () => {
		return image(
			combineProps(variantProps, {
				get disableAnimation() {
					return reactiveStates.isDisableAnimation;
				},
				get showSkeleton() {
					return reactiveStates.showSkeleton;
				},
			}),
		);
	};

	const getImgProps: PropGetter<HTMLImageElement> = (props = {}) => {
		return mergeProps(rest, {
			ref: mergeRefs(local.ref, setDomRef),
			src: local.src,
			srcSet: local.srcSet,
			get "data-loaded"() {
				return dataAttr(reactiveStates.isImgLoaded);
			},
			get class() {
				return slots().img({
					class: clsx(reactiveStates.baseStyles, props?.class),
				});
			},
			get loading() {
				return local.loading;
			},
			sizes: local.sizes,
			crossorigin: local.crossorigin ?? local.crossOrigin,
		});
	};

	const getWrapperProps: PropGetter = () => {
		const fallbackStyle = () => {
			if (local.fallbackSrc) {
				return {
					backgroundImage: `url(${local.fallbackSrc})`,
				};
			}
			return {};
		};

		return {
			class: slots().wrapper({
				class: local.classes?.wrapper,
			}),
			style: {
				...fallbackStyle(),
				"max-width": reactiveStates.width.w,
			},
		};
	};

	const getBlurredImgProps: PropGetter = () => {
		return {
			src: local.src,
			"aria-hidden": dataAttr(true),
			class: slots().blurredImg({
				class: clsx(local.classes?.blurredImg),
			}),
		};
	};

	return {
		Component,
		reactiveStates,
		get disableSkeleton() {
			return local.disableSkeleton;
		},
		get removeWrapper() {
			return local.removeWrapper;
		},
		domRef,
		slots,
		getImgProps,
		getWrapperProps,
		getBlurredImgProps,
	};
}

export type UseImageReturn = ReturnType<typeof useImage>;
