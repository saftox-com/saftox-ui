import type { ContextType, UseRadioGroupProps } from './radio-types'
import type { PropGetter } from '@saftox-ui/system'

import { createRadioGroup, createRadioGroupState } from './aria'

import { createSignal, mergeProps, splitProps } from 'solid-js'

import { clsx, safeAriaLabel } from '@saftox-ui/shared-utils'
import { combineProps, mergeRefs, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { useProviderContext } from '@saftox-ui/system'
import { radioGroup } from '@saftox-ui/theme'
import { filterDOMProps } from '@saftox-ui/utils'

export function useRadioGroup(originalProps: UseRadioGroupProps) {
  const globalContext = useProviderContext()

  const defaultProps = {
    size: 'md',
    color: 'primary',
    isDisabled: false,
    orientation: 'vertical',
    isRequired: false,
  }

  const props = mergeProps(
    defaultProps,
    {
      get validationBehavior() {
        return globalContext?.validationBehavior ?? 'aria'
      },
      get disableAnimation() {
        return globalContext?.disableAnimation ?? false
      },
    },
    originalProps,
  )

  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'classes',
    'label',
    'value',
    'name',
    'isInvalid',
    'validationState',
    'validationBehavior',
    'size',
    'color',
    'isDisabled',
    'disableAnimation',
    'orientation',
    'isRequired',
    'isReadOnly',
    'errorMessage',
    'description',
    'class',
    'onChange',
    'onValueChange',
  ])

  const Component = local.as || 'div'
  const shouldFilterDOMProps = typeof Component === 'string'

  const [domRef, setDomRef] = createSignal<HTMLDivElement>()

  const properties = {
    get isInvalid() {
      return otherPropsWithOrientation.isInvalid || local.isInvalid || displayValidation().isInvalid
    },
    get errorMessage() {
      return typeof local.errorMessage === 'function'
        ? local.errorMessage(mergeProps(displayValidation(), this.isInvalid))
        : local.errorMessage || displayValidation().validationErrors?.join(' ')
    },
  }

  const otherPropsWithOrientation = mergeProps(
    rest,
    pickProps(local, [
      'value',
      'name',
      'isRequired',
      'isReadOnly',
      // 'orientation',
      'validationBehavior',
    ]),
    {
      get 'aria-label'() {
        return safeAriaLabel(rest['aria-label'], local.label)
      },
      get isInvalid() {
        return local.validationState === 'invalid' || local.isInvalid
      },
    },
    {
      onChange: local.onValueChange,
    },
  )

  const groupState = createRadioGroupState(otherPropsWithOrientation)

  const {
    labelProps,
    radioGroupProps: groupProps,
    errorMessageProps,
    descriptionProps,
    displayValidation,
  } = createRadioGroup(otherPropsWithOrientation, groupState)

  const context = mergeProps(
    pickProps(local, ['color', 'size', 'isRequired', 'isDisabled', 'disableAnimation']),
    {
      groupState,
    },
    {
      get isInvalid() {
        return properties.isInvalid
      },
    },
  ) as ContextType

  const slots = () =>
    radioGroup(
      mergeProps(pickProps(local, ['isRequired', 'disableAnimation']), {
        get isInvalid() {
          return properties.isInvalid
        },
      }),
    )

  const baseStyles = () => clsx(local.classes?.base, local.class)

  const getGroupProps: PropGetter = () =>
    mergeProps(
      props,
      {
        ref: mergeRefs(local.ref, setDomRef),
        get class() {
          return slots().base({ class: baseStyles() })
        },
      },
      combineProps(
        groupProps,
        filterDOMProps(rest, {
          enabled: shouldFilterDOMProps,
        }),
      ),
    )

  const getLabelProps: PropGetter = () =>
    mergeProps(
      {
        get class() {
          return slots().label({ class: local.classes?.label })
        },
      },
      labelProps,
    )

  const getWrapperProps: PropGetter = () => ({
    role: 'orientation',
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
        return slots().description({ class: clsx(local.classes?.description, props?.class) })
      },
    })

  const getErrorMessageProps: PropGetter = (props = {}) =>
    mergeProps(props, errorMessageProps, {
      get class() {
        return slots().errorMessage({ class: clsx(local.classes?.errorMessage, props?.class) })
      },
    })

  return {
    Component,
    local,
    context,
    domRef,
    properties,
    getGroupProps,
    getLabelProps,
    getWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
  }
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>
