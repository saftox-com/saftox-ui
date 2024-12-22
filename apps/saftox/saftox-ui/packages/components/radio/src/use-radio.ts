import type { UseRadioProps } from './radio-types'
import type { PropGetter } from '@saftox-ui/system'

import { useRadioGroupContext } from './radio-group-context'

import {
  children as resolveChildren,
  createEffect,
  createSignal,
  createUniqueId,
  DEV,
  mergeProps,
  splitProps,
} from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { createHover, createPress } from '@saftox-ui/interactions'
import { clsx, dataAttr, issueWarning } from '@saftox-ui/shared-utils'
import { combineProps, mergeRefs, pickProps } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { radio } from '@saftox-ui/theme'

import { createRadio } from './aria/create-radio'

export function useRadio(originalProps: UseRadioProps) {
  const globalContext = useProviderContext()
  const groupContext = useRadioGroupContext()

  const children = resolveChildren(() => originalProps.children)
  const resolvedChildren = children()

  const defaultProps = {
    size: 'md',
    color: 'primary',
    isDisabled: false,
    autofocus: false,
  } as UseRadioProps

  const props = mergeProps(defaultProps, groupContext, originalProps)

  const [local, rest] = splitProps(props, [
    'as',
    'ref',
    'id',
    'value',
    'description',
    'size',
    'color',
    'isDisabled',
    'onChange',
    'autofocus',
    'classes',
    'class',
  ])

  if (groupContext && DEV) {
    if ('checked' in rest) {
      issueWarning('Remove props "checked" if in the Radio.Group.', 'Radio')
    }
    if (local.value === undefined) {
      issueWarning('Props "value" must be defined if in the Radio.Group.', 'Radio')
    }
  }

  const Component = local.as || 'label'

  const labelId = createUniqueId()

  const [domRef, setDomRef] = createSignal<HTMLLabelElement>()
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>()

  const properties = {
    get disableAnimation() {
      return groupContext?.disableAnimation ?? globalContext?.disableAnimation ?? false
    },
    get isRequired() {
      return groupContext.isRequired ?? false
    },
    get isInvalid() {
      return groupContext.isInvalid
    },
    get isDisabled() {
      return groupContext.isDisabled
    },
    get interactionDisabled() {
      return local.isDisabled || inputProps.readOnly
    },
    get pressed() {
      return this.interactionDisabled ? false : isPressed || radioStates.isPressed
    },
    get baseStyles() {
      return clsx(local.classes?.base, local.class)
    },
  }

  const ariaRadioProps = () => {
    const ariaLabel =
      rest['aria-label'] || typeof resolvedChildren === 'string'
        ? (resolvedChildren as string)
        : undefined

    const ariaDescribedBy =
      rest['aria-describedby'] || typeof local.description === 'string'
        ? (local.description as string)
        : undefined

    return mergeProps(
      {
        id: local.id as string,
        isRequired: properties.isRequired,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': rest['aria-labelledby'] || labelId,
      },
      {
        get isDisabled() {
          return local.isDisabled
        },
      },
    )
  }

  const { inputProps, states: radioStates } = createRadio(
    mergeProps(
      {
        get value() {
          return local.value
        },
        children: resolvedChildren,
      },
      groupContext,
      ariaRadioProps(),
    ),
    groupContext.groupState,
    inputRef,
  )

  const { focusProps, isFocused, isFocusVisible } = createFocusRing({
    autofocus: local.autofocus,
  })

  // Handle press state for full label. Keyboard press state is returned by useCheckbox
  // since it is handled on the <input> element itself.
  const [isPressed, setPressed] = createSignal(false)
  const { pressProps } = createPress({
    get isDisabled() {
      return properties.interactionDisabled
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

  const { hoverProps, isHovered } = createHover({
    get isDisabled() {
      return properties.interactionDisabled
    },
  })

  const slots = () =>
    radio({
      get color() {
        return local.color
      },
      get size() {
        return local.size
      },
      get isInvalid() {
        return properties.isInvalid
      },
      get isDisabled() {
        return properties.isDisabled
      },
      get disableAnimation() {
        return false
      },
    })

  const getBaseProps: PropGetter = (props = {}) =>
    mergeProps(
      props,
      {
        ref: mergeRefs(local.ref, setDomRef),
        get class() {
          return slots().base({ class: properties.baseStyles })
        },
        get 'data-disabled'() {
          return dataAttr(radioStates.isDisabled)
        },
        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },
        get 'data-selected'() {
          return dataAttr(radioStates.isSelected)
        },
        get 'data-invalid'() {
          return dataAttr(properties.isInvalid)
        },
        get 'data-hover'() {
          return dataAttr(isHovered)
        },
        get 'data-pressed'() {
          return dataAttr(properties.pressed)
        },
        get 'data-hover-unselected'() {
          return dataAttr(isHovered() && !radioStates.isSelected)
        },
        get 'data-readonly'() {
          return dataAttr(inputProps.readOnly)
        },
        get 'aria-required'() {
          return dataAttr(properties.isRequired)
        },
      },
      combineProps(hoverProps, pressProps),
    )

  const getWrapperProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      'aria-hidden': true,
      get class() {
        return clsx(slots().wrapper({ class: clsx(local.classes?.wrapper, props.class) }))
      },
    })

  const getInputProps: PropGetter = (props = {}) =>
    mergeProps(
      {
        ref: setInputRef,
      },
      combineProps(props, inputProps, focusProps),
      {
        onChange: local.onChange,
      },
    )

  const getLabelProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      id: labelId,
      get class() {
        return slots().label({ class: local.classes?.label })
      },
    })

  const getLabelWrapperProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      get class() {
        return slots().labelWrapper({ class: local.classes?.labelWrapper })
      },
    })

  const getControlProps: PropGetter = (props = {}) =>
    mergeProps(props, {
      get class() {
        return slots().control({ class: local.classes?.control })
      },
    })

  return {
    Component,
    children: resolvedChildren,
    local,
    slots,
    properties,
    radioStates,
    isFocusVisible,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  }
}

export type UseRadioReturn = ReturnType<typeof useRadio>
