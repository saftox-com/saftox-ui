import type { CheckboxIconProps, UseCheckboxProps } from './checkbox-types'
import type { PropGetter } from '@saftox-ui/system'

import { useCheckboxGroupContext } from './checkbox-group-context'

import {
  children as resolveChildren,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  mergeProps,
  splitProps,
} from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { createHover, createPress } from '@saftox-ui/interactions'
import { chain, clsx, dataAttr, issueWarning, safeAriaLabel } from '@saftox-ui/shared-utils'
import { mergeRefs, omitProps, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { useProviderContext } from '@saftox-ui/system'
import { checkbox } from '@saftox-ui/theme'
import { createToggleState } from '@saftox-ui/toggle'

import { createCheckbox } from './aria/create-checkbox'
import { createCheckboxGroupItem } from './aria/create-checkbox-group-item'

export function useCheckbox(originalProps: UseCheckboxProps) {
  const globalContext = useProviderContext()
  const groupContext = useCheckboxGroupContext()
  const isInGroup = Boolean(groupContext)

  const propsWithoutChildren = omitProps(originalProps, ['children'])
  const children = resolveChildren(() => originalProps.children)

  const defaultProps = {
    value: '',
    isReadOnly: false,
    autofocus: false,
    size: 'md',
    color: 'primary',
    lineThrough: false,
    isDisabled: false,
    isIndeterminate: false,
  }

  const props = mergeProps(defaultProps, groupContext, propsWithoutChildren)

  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'value',
    'icon',
    'name',
    'isRequired',
    'isReadOnly',
    'autofocus',
    'isSelected',
    'size',
    'color',
    'radius',
    'lineThrough',
    'isDisabled',
    'disableAnimation',
    'validationState',
    'isInvalid',
    'isIndeterminate',
    'defaultSelected',
    'classes',
    'class',
    'onValueChange',
  ])

  if (groupContext) {
    if (local.isSelected) {
      issueWarning(
        'The Checkbox.Group is being used, `isSelected` will be ignored. Use the `value` of the Checkbox.Group instead.',
        'Checkbox',
      )
    }
    if (local.defaultSelected) {
      issueWarning(
        'The Checkbox.Group is being used, `defaultSelected` will be ignored. Use the `defaultValue` of the Checkbox.Group instead.',
        'Checkbox',
      )
    }
  }

  const Component = local.as || 'label'
  const [domRef, setDomRef] = createSignal<HTMLLabelElement>()
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>()

  const pickAriaCheckboxProps = pickProps(local, [
    'name',
    'value',
    'autofocus',
    'defaultSelected',
    'isIndeterminate',
    'isRequired',
    'isInvalid',
    'isSelected',
    'isDisabled',
    'isReadOnly',
  ])

  const labelId = createUniqueId()

  const ariaCheckboxProps = mergeProps(pickAriaCheckboxProps, {
    children: originalProps.children,
    onChange: local.onValueChange,
    get 'aria-label'() {
      return safeAriaLabel(rest['aria-label'], children())
    },
    get 'aria-labelledby'() {
      return rest['aria-labelledby'] || labelId
    },
  })

  const toggleState = createToggleState(ariaCheckboxProps)

  const { inputProps, states: checkboxStates } = isInGroup
    ? createCheckboxGroupItem(ariaCheckboxProps, groupContext.groupState, inputRef)
    : createCheckbox(ariaCheckboxProps, toggleState, inputRef)

  const properties = {
    get isAnimationDisabled() {
      return groupContext?.disableAnimation ?? globalContext?.disableAnimation ?? false
    },
    get isInteractionDisabled() {
      return local.isDisabled || local.isReadOnly
    },
    get IsInvalid() {
      return local.validationState
        ? local.validationState === 'invalid'
        : groupContext?.isInvalid ?? false
    },
    get isPressed() {
      return this.isInteractionDisabled ? false : isPressed() || checkboxStates.isPressed
    },
    get baseStyles() {
      return clsx(local.classes?.base, local.class)
    },
  }

  // Handle press state for full label. Keyboard press state is returned by useCheckbox
  // since it is handled on the <input> element itself.
  const [isPressed, setPressed] = createSignal(false)
  const { pressProps } = createPress({
    get isDisabled() {
      return properties.isInteractionDisabled
    },
    onPressStart(e) {
      if (e.pointerType !== 'keyboard') {
        setPressed(true)
      }
    },
    onPressEnd(e) {
      if (e.pointerType !== 'keyboard') {
        setPressed(false)
      }
    },
  })

  if (local.isRequired) {
    inputProps.required = true
  }

  const { hoverProps, isHovered } = createHover({
    get isDisabled() {
      return inputProps.disabled
    },
  })

  const { focusProps, isFocused, isFocusVisible } = createFocusRing({
    autofocus: inputProps.autofocus,
  })

  const slots = createMemo(() =>
    checkbox(
      mergeProps(
        // variantProps,
        {
          get disableAnimation() {
            return properties.isAnimationDisabled
          },
        },
      ),
    ),
  )

  const handleCheckboxChange = (e: Event) => {
    if (properties.isInteractionDisabled) {
      e.preventDefault()

      return
    }
  }

  const getBaseProps: PropGetter = () =>
    mergeProps(
      {
        ref: setDomRef,
        class: slots().base({ class: properties.baseStyles }),
        get 'data-disabled'() {
          return dataAttr(local.isDisabled)
        },
        get 'data-selected'() {
          return dataAttr(checkboxStates.isSelected || local.isIndeterminate)
        },
        get 'data-invalid'() {
          return dataAttr(properties.IsInvalid)
        },
        get 'data-hover'() {
          return dataAttr(isHovered)
        },
        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get 'data-pressed'() {
          return dataAttr(properties.isPressed)
        },
        get 'data-readonly'() {
          return dataAttr(inputProps.readOnly)
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },
        get 'data-indeterminate'() {
          return dataAttr(local.isIndeterminate)
        },
      },
      hoverProps,
      pressProps,
      rest,
    )

  const getWrapperProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      'aria-hidden': true,
      get class() {
        return slots().wrapper({
          class: clsx(local.classes?.wrapper, props?.class),
        })
      },
    })

  const getInputProps: PropGetter = () =>
    mergeProps(
      {
        ref: mergeRefs(local.ref, setInputRef),
      },
      inputProps,
      focusProps,
      {
        onChange: chain(inputProps.onChange, handleCheckboxChange),
      },
    )

  const getLabelProps = {
    id: labelId,
    get class() {
      return slots().label({
        class: clsx(local.classes?.label),
      })
    },
  }

  const getIconProps = (): Omit<CheckboxIconProps, 'data-checked'> => ({
    get isSelected() {
      return checkboxStates.isSelected
    },
    get isIndeterminate() {
      return Boolean(local.isIndeterminate)
    },
    get disableAnimation() {
      return Boolean(local.disableAnimation)
    },
    get class() {
      return slots().icon({
        class: clsx(local.classes?.icon),
      })
    },
  })

  return {
    Component,
    children,
    local,
    properties,
    domRef,
    icon: local.icon,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getIconProps,
    getLabelProps,
  }
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>
