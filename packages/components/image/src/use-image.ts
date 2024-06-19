import type { PropGetter } from '@saftox-ui/system'
import type { UseImageProps } from './image-types'

import { clsx, dataAttr } from '@saftox-ui/shared-utils'
import { mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { useProviderContext } from '@saftox-ui/system'
import { mapPropsVariants } from '@saftox-ui/system'
import { image } from '@saftox-ui/theme'
import { useImage as useImageBase } from '@saftox-ui/use-image'
import { createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

export function useImage(originalProps: UseImageProps) {
  const globalContext = useProviderContext()

  const [ommitVariantProps, variantProps] = mapPropsVariants(originalProps, image.variantKeys)

  const defaultProps = {
    get disableSkeleton() {
      return !!originalProps.fallbackSrc
    },
    removeWrapper: false,
  }

  const props = mergeProps(defaultProps, ommitVariantProps)

  const [local, rest] = splitProps(props, [
    'ref',
    'as',
    'src',
    'class',
    'classes',
    'loading',
    'fallbackSrc',
    'isBlurred',
    'isLoading',
    'disableSkeleton',
    'removeWrapper',
    'onError',
    'onSuccess',
    'onLoad',
    'srcSet',
    'sizes',
    'crossorigin',
    'crossOrigin',
  ])

  const Component = local.as || 'img'

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
  )

  const properties = {
    get isDisableAnimation() {
      return originalProps.disableAnimation ?? globalContext.disableAnimation ?? false
    },
    get isImgLoaded() {
      return imageStatus.isReady() && !local.isLoading
    },
    get isLoading() {
      return imageStatus.isLoading() || local.isLoading
    },
    get isBlurred() {
      return local.isBlurred
    },
    get isZoomed() {
      return originalProps.isZoomed
    },
    get showFallback() {
      return (!local.src || !this.isImgLoaded) && !!local.fallbackSrc
    },
    get showSkeleton() {
      return this.isLoading && !local.disableSkeleton
    },
    get width() {
      return {
        get w() {
          return originalProps.width
            ? typeof originalProps.width === 'number'
              ? `${originalProps.width}px`
              : originalProps.width
            : 'auto'
        },
      }
    },
    get baseStyles() {
      return clsx(local.class, local.classes?.img)
    },
  }

  const [domRef, setDomRef] = createSignal<HTMLImageElement>()

  const slots = createMemo(() =>
    image(
      mergeProps(variantProps, {
        get disableAnimation() {
          return properties.isDisableAnimation
        },
        get showSkeleton() {
          return properties.showSkeleton
        },
      }),
    ),
  )

  const getImgProps: PropGetter<HTMLImageElement> = (props = {}) => {
    return mergeProps(rest, {
      ref: mergeRefs(local.ref, setDomRef),
      src: local.src,
      srcSet: local.srcSet,
      get 'data-loaded'() {
        return dataAttr(properties.isImgLoaded)
      },
      get class() {
        return slots().img({
          class: clsx(properties.baseStyles, props?.class),
        })
      },
      get loading() {
        return local.loading
      },
      sizes: local.sizes,
      crossorigin: local.crossorigin ?? local.crossOrigin,
    })
  }

  const getWrapperProps: PropGetter = () => {
    const fallbackStyle = () => {
      if (local.fallbackSrc) {
        return {
          backgroundImage: `url(${local.fallbackSrc})`,
        }
      }
      return {}
    }

    return {
      class: slots().wrapper({
        class: local.classes?.wrapper,
      }),
      style: {
        ...fallbackStyle(),
        'max-width': properties.width.w,
      },
    }
  }

  const getBlurredImgProps: PropGetter = () => {
    return {
      src: local.src,
      'aria-hidden': dataAttr(true),
      class: slots().blurredImg({
        class: clsx(local.classes?.blurredImg),
      }),
    }
  }

  return {
    Component,
    properties,
    get disableSkeleton() {
      return local.disableSkeleton
    },
    get removeWrapper() {
      return local.removeWrapper
    },
    domRef,
    slots,
    getImgProps,
    getWrapperProps,
    getBlurredImgProps,
  }
}

export type UseImageReturn = ReturnType<typeof useImage>
