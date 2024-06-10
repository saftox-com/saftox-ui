import type { Ref } from "@saftox-ui/solid-utils/dom";
import type { HTMLSaftoxUIProps, PropGetter } from "@saftox-ui/system";
import type {
	ImageSlots,
	ImageVariantProps,
	SlotsToClasses,
} from "@saftox-ui/theme";
import type { Accessor, JSX } from "solid-js";

type NativeImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

interface Props extends HTMLSaftoxUIProps<"img"> {
	/**
	 * Ref to the DOM node.
	 */
	ref?: Ref<HTMLImageElement>;
	/**
	 * Whether to add a blurred effect to the image.
	 * @default false
	 */
	isBlurred?: boolean;
	/**
	 * A fallback image.
	 */
	fallbackSrc?: JSX.Element;
	/**
	 * Whether to disable the loading skeleton.
	 * @default false
	 */
	disableSkeleton?: boolean;
	/**
	 * A callback for when the image `src` has been loaded
	 */
	onLoad?: NativeImageProps["onLoad"];
	/**
	 * A loading strategy to use for the image.
	 */
	loading?: NativeImageProps["loading"];
	/**
	 * Whether to remove the wrapper element. This will cause the image to be rendered as a direct child of the parent element.
	 * If you set this prop as `true` neither the skeleton nor the zoom effect will work.
	 * @default false
	 */
	removeWrapper?: boolean;
	/**
	 * Controlled loading state.
	 */
	isLoading?: boolean;
	/**
	 * Function called when image failed to load
	 */
	onError?: () => void;
	/**
	 * Function called when image load succeed
	 */
	onSuccess?: () => void;
	/**
	 * class or List of classes to change the classes of the element.
	 * if `class` is passed, it will be added to the base slot.
	 *
	 * @example
	 * ```ts
	 * <Image classes={{
	 *    base:"base-classes", // image classes
	 *    wrapper: "wrapper-classes",
	 *    blurredImg: "blurredImg-classes", // this is a cloned version of the img
	 * }} />
	 * ```
	 */
	classes?: SlotsToClasses<ImageSlots>;
}

export type UseImageProps = Props & ImageVariantProps;
