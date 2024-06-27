import type { CheckboxGroupProps } from './aria/create-checkbox-group'
import type { ContextType, UseCheckboxGroupProps } from './checkbox-types'
import type { PropGetter } from '@saftox-ui/system'

import { createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

import { chain, clsx, safeAriaLabel } from '@saftox-ui/shared-utils'
import { pickProps } from '@saftox-ui/solid-utils/reactivity'
import { useProviderContext } from '@saftox-ui/system'
import { checkboxGroup } from '@saftox-ui/theme'
import { filterDOMProps } from '@saftox-ui/utils'

import { createCheckboxGroup } from './aria/create-checkbox-group'
import { createCheckboxGroupState } from './aria/create-checkbox-group-state'

export function useCheckboxGroup(originalProps: UseCheckboxGroupProps) {
  const globalContext = useProviderContext()

  const defaultProps: UseCheckboxGroupProps = {
    size: 'md',
    color: 'primary',
    orientation: 'vertical',
    lineThrough: false,
    isDisabled: false,
  }

  const props = mergeProps(defaultProps, originalProps)

  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'classes',
    'children',
    'label',
    'radius',
    'value',
    'name',
    'defaultValue',
    'isInvalid',
    'validationState',
    'size',
    'color',
    'orientation',
    'lineThrough',
    'isDisabled',
    'validationBehavior',
    'disableAnimation',
    'isReadOnly',
    'isRequired',
    'onValueChange',
    'description',
    'errorMessage',
    'class',
  ])

  const Component = local.as || 'div'
  const shouldFilterDOMProps = typeof Component === 'string'

  const [domRef, setDomRef] = createSignal<HTMLElement>()

  const checkboxGroupProps: CheckboxGroupProps = mergeProps(
    pickProps(local, ['value', 'name', 'defaultValue', 'orientation', 'isDisabled', 'isReadOnly']),
    rest,
    {
      get 'aria-label'() {
        return safeAriaLabel(rest['aria-label'], local.label)
      },
      get IsInvalid() {
        return properties.isInvalid
      },
      onChange: chain(rest.onChange, local.onValueChange),
    },
  )

  const groupState = createCheckboxGroupState(checkboxGroupProps)

  const { labelProps, groupProps, descriptionProps, errorMessageProps, displayValidation } =
    createCheckboxGroup(checkboxGroupProps, groupState)

  const properties = {
    get disableAnimation() {
      return local.disableAnimation ?? globalContext?.disableAnimation ?? false
    },
    get validationBehavior() {
      return globalContext?.validationBehavior ?? 'aria'
    },
    get isInvalid() {
      return groupState.isInvalid()
    },
    get errorMessage() {
      return typeof local.errorMessage === 'function'
        ? local.errorMessage({
            get isInvalid() {
              return this.isInvalid
            },
            get validationErrors() {
              return displayValidation().validationErrors
            },
            get validationDetails() {
              return displayValidation().validationDetails
            },
          })
        : local.errorMessage || displayValidation().validationErrors?.join(' ')
    },
    get baseStyle() {
      return clsx(local.classes, local.class)
    },
  }

  const context: ContextType = mergeProps(
    pickProps(local, ['size', 'color', 'radius', 'lineThrough', 'isDisabled']),
    pickProps(properties, ['disableAnimation', 'isInvalid', 'validationBehavior']),
    {
      get groupState() {
        return groupState
      },
    },
  )

  const slots = createMemo(() =>
    checkboxGroup({
      get disableAnimation() {
        return properties.disableAnimation
      },
    }),
  )

  const getGroupProps: PropGetter = (props = {}) =>
    mergeProps(
      {
        ref: setDomRef,
        get class() {
          return slots().base({ class: properties.baseStyle })
        },
      },
      groupProps,
      filterDOMProps(rest, {
        enabled: shouldFilterDOMProps,
      }),
    )

  const getLabelProps: PropGetter = () =>
    mergeProps(labelProps, {
      get class() {
        return slots().label({ class: local.classes?.label })
      },
    })

  const getWrapperProps: PropGetter = () => ({
    role: 'presentation',
    get class() {
      return slots().wrapper({ class: local.classes?.wrapper })
    },
    get 'data-orientation'() {
      return local.orientation
    },
  })

  const getDescriptionProps: PropGetter = (props = {}) =>
    mergeProps(props, descriptionProps, {
      get class() {
        return slots().description({
          class: clsx(local.classes?.description, props?.class),
        })
      },
    })

  const getErrorMessageProps: PropGetter = (props = {}) =>
    mergeProps(props, errorMessageProps, {
      get class() {
        return slots().errorMessage({
          class: clsx(local.classes?.errorMessage, props?.class),
        })
      },
    })

  return {
    Component,
    domRef,
    local,
    properties,
    context,
    getGroupProps,
    getLabelProps,
    getWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
  }
}

export type UseCheckboxGroupReturn = ReturnType<typeof useCheckboxGroup>
