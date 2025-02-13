import type { UseTextfieldProps } from './textfield-types'
import type { PropGetter } from '@saftox-ui/system'

import { createTextField } from './aria'

import { createEffect, createMemo, createSignal, mergeProps, splitProps } from 'solid-js'

import { createFocusRing } from '@saftox-ui/focus'
import { createFocusWithin, createHover, createPress } from '@saftox-ui/interactions'
import { chain, clsx, dataAttr, isEmpty, safeAriaLabel } from '@saftox-ui/shared-utils'
import { mergeRefs } from '@saftox-ui/solid-utils/reactivity'
import { mapPropsVariants, useProviderContext } from '@saftox-ui/system'
import { textfield } from '@saftox-ui/theme'
import { createControllableSignal, filterDOMProps } from '@saftox-ui/utils'

export function useTextfield<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(
  originalProps: UseTextfieldProps<T>,
) {
  const globalContext = useProviderContext()

  const [ommitVariantProps, variantsProps] = mapPropsVariants(originalProps, textfield.variantKeys)

  const defaultProps = {
    get validationBehavior() {
      return globalContext?.validationBehavior ?? 'aria'
    },
    onValueChange: () => {},
    onValueInput: () => {},
  }

  const props = mergeProps(defaultProps, ommitVariantProps)

  const [local, rest] = splitProps(props, [
    'ref',
    'as',
    'type',
    'label',
    'baseRef',
    'wrapperRef',
    'description',
    'class',
    'classes',
    'autofocus',
    'startContent',
    'endContent',
    'onClear',
    'onChange',
    'onInput',
    'validationState',
    'validationBehavior',
    'innerWrapperRef',
    'onValueChange',
    'onValueInput',
  ])

  const Component = local.as || 'div'

  const [isFocusWithin, setFocusWithin] = createSignal(false)

  const [domRef, setDomRef] = createSignal<T>()
  const [baseDomRef, setBaseDomRef] = createSignal<HTMLDivElement>()
  const [inputWrapperRef, setInputWrapperRef] = createSignal<HTMLDivElement>()
  const [innerWrapperRef, setInnerWrapperRef] = createSignal<HTMLDivElement>()

  const handleValueChange = (value: string | undefined) => {
    local.onValueChange(value ?? '')
    local.onValueInput(value ?? '')
  }

  const [inputValue, setInputValue] = createControllableSignal({
    value: () => rest.value,
    defaultValue: () => rest.defaultValue ?? '',
    onChange: handleValueChange,
  })

  const handleClear = () => {
    setInputValue('')
    local.onClear?.()

    domRef()?.focus()
  }

  const { labelProps, inputProps, descriptionProps, errorMessageProps, displayValidation } =
    createTextField(
      mergeProps(originalProps as any, {
        get validationBehavior() {
          return local.validationBehavior
        },
        get value() {
          return inputValue()
        },
        get autocapitalize() {
          return originalProps.autocapitalize
        },
        get 'aria-label'() {
          return safeAriaLabel(
            originalProps?.['aria-label'],
            originalProps?.label,
            originalProps?.placeholder,
          )
        },
        get inputElementType() {
          return properties.isMultiline ? 'textarea' : 'input'
        },
        onChange: setInputValue,
        onInput: (e: InputEvent) => setInputValue((e.target as T).value),
      }),
      domRef,
    )

  const { isHovered, hoverProps } = createHover({
    isDisabled: !!originalProps?.isDisabled,
  })

  const { isFocusVisible, isFocused, focusProps } = createFocusRing({
    autofocus: local.autofocus,
    isTextInput: true,
  })

  const { focusProps: clearFocusProps, isFocusVisible: isClearButtonFocusVisible } =
    createFocusRing()

  const { focusWithinProps } = createFocusWithin({
    onFocusWithinChange: setFocusWithin,
  })

  const { pressProps: clearPressProps } = createPress({
    get isDisabled() {
      return !!originalProps?.isDisabled
    },
    onPress: handleClear,
  })

  const properties = {
    get disableAnimation() {
      return originalProps.disableAnimation ?? globalContext.disableAnimation ?? false
    },
    get baseStyles() {
      return clsx(local.classes?.base, local.class, this.isFilled && 'is-filled')
    },
    get labelPlacement() {
      if (
        (!originalProps.labelPlacement || originalProps.labelPlacement === 'inside') &&
        !local.label
      ) {
        return 'outside'
      }
      return originalProps.labelPlacement ?? 'inside'
    },
    get errorMessage() {
      return typeof props.errorMessage === 'function'
        ? props.errorMessage(mergeProps(displayValidation, this.isInvalid))
        : props.errorMessage || displayValidation()?.validationErrors?.join(' ')
    },

    //
    get isFilledByDefault() {
      return ['date', 'time', 'month', 'week', 'range'].includes(local.type!)
    },
    get isFilled() {
      return !isEmpty(inputValue()) || this.isFilledByDefault
    },
    get isFilledWithin() {
      return this.isFilled || isFocusWithin()
    },
    get isMultiline() {
      return originalProps.isMultiline
    },
    get isInvalid() {
      return (
        local.validationState === 'invalid' ||
        originalProps.isInvalid ||
        displayValidation()?.isInvalid
      )
    },
    get isClearable() {
      return !!local.onClear || originalProps.isClearable
    },
    get isPlaceholderShown() {
      const domRefValue = domRef()?.value
      const inputValueValue = inputValue()
      return (
        (!domRefValue || domRefValue === '' || !inputValueValue || inputValueValue === '') &&
        this.hasPlaceholder
      )
    },
    get isOutsideLeft() {
      return this.labelPlacement === 'outside-left'
    },
    get isLabelOutside() {
      return (
        this.shouldLabelBeOutside &&
        (this.labelPlacement === 'outside-left' ||
          this.hasPlaceholder ||
          (this.labelPlacement === 'outside' && this.hasStartContent))
      )
    },
    get isLabelOutsideAsPlaceholder() {
      return this.labelPlacement === 'outside' && !this.hasPlaceholder && !this.hasStartContent
    },

    //
    get hasElements() {
      return !!local.label || !!local.description || !!this.errorMessage
    },
    get hasPlaceholder() {
      return !!originalProps.placeholder
    },
    get hasLabel() {
      return !!local.label
    },
    get hasHelper() {
      return !!local.description || !!this.errorMessage
    },
    get hasStartContent() {
      return 'startContent' in originalProps
    },

    get hasEndContent() {
      return 'endContent' in originalProps
    },

    //
    get shouldLabelBeOutside() {
      return this.labelPlacement === 'outside' || this.labelPlacement === 'outside-left'
    },
    get shouldLabelBeInside() {
      return this.labelPlacement === 'inside'
    },
  }

  const slots = createMemo(() =>
    textfield(
      mergeProps(variantsProps, {
        get isInvalid() {
          return properties.isInvalid
        },
        get isClearable() {
          return properties.isClearable
        },
        get disableAnimation() {
          return properties.disableAnimation
        },
      }),
    ),
  )

  const getBaseProps: PropGetter = (props = {}, ref) => {
    return mergeProps(
      {
        'data-slot': 'base',
        get class() {
          return slots().base({ class: properties.baseStyles })
        },
        get 'data-filled'() {
          return dataAttr(
            properties.isFilled ||
              properties.hasPlaceholder ||
              properties.hasStartContent ||
              properties.isPlaceholderShown,
          )
        },
        get 'data-filled-within'() {
          return dataAttr(
            properties.isFilledWithin ||
              properties.hasPlaceholder ||
              properties.hasStartContent ||
              properties.isPlaceholderShown,
          )
        },
        get 'data-focus-within'() {
          return dataAttr(isFocusWithin)
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },

        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get 'data-hover'() {
          return dataAttr(isHovered)
        },
        get 'data-readonly'() {
          return dataAttr(originalProps.isReadOnly)
        },
        get 'data-disabled'() {
          return dataAttr(originalProps.isDisabled)
        },
        get 'data-invalid'() {
          return dataAttr(properties.isInvalid)
        },
        get 'data-has-elements'() {
          return dataAttr(properties.hasElements)
        },
        get 'data-has-helper'() {
          return dataAttr(properties.hasHelper)
        },
        get 'data-has-label'() {
          return dataAttr(properties.hasLabel)
        },
        get 'data-has-value'() {
          return dataAttr(!properties.isPlaceholderShown)
        },
      },
      focusWithinProps,
      props,
      {
        ref: mergeRefs(local.baseRef ?? ref, setBaseDomRef),
      },
    )
  }

  const getLabelProps: PropGetter<HTMLLabelElement> = (props = {}) => {
    return mergeProps(
      {
        'data-slot': 'label',
        get class() {
          return slots().label({ class: local.classes?.label })
        },
      },
      labelProps,
      props,
    )
  }

  const getInputProps: PropGetter = (props = {}, ref) => {
    return mergeProps(
      {
        'data-slot': 'input',
        get 'data-filled'() {
          return dataAttr(properties.isFilled)
        },
        get 'data-filled-within'() {
          return dataAttr(properties.isFilledWithin)
        },
        get 'data-has-start-content'() {
          return dataAttr(properties.hasStartContent)
        },
        get 'data-has-end-content'() {
          return dataAttr(!!local.endContent)
        },
        get class() {
          return slots().input({
            class: clsx(local.classes?.input, properties.isFilled && 'is-filled'),
          })
        },
      },
      inputProps,
      focusProps,
      filterDOMProps(rest, {
        labelable: true,
        omitEventNames: new Set(Object.keys(inputProps)),
      }),
      props,
      {
        ref: mergeRefs(local.ref ?? ref, setDomRef),
        get 'aria-readonly'() {
          return dataAttr(originalProps.isReadOnly)
        },
        onChange: local.onChange,
        onInput: local.onInput,
      },
    )
  }

  const getInputWrapperProps: PropGetter = (props = {}, ref) => {
    return mergeProps(
      {
        'data-slot': 'input-wrapper',
        get 'data-hover'() {
          return dataAttr(isHovered)
        },
        get 'data-focus-visible'() {
          return dataAttr(isFocusVisible)
        },
        get 'data-focus'() {
          return dataAttr(isFocused)
        },
        get class() {
          return slots().inputWrapper({
            class: clsx(local.classes?.inputWrapper, properties.isFilled && 'is-filled'),
          })
        },
        onClick: (e: MouseEvent) => {
          if (domRef() && e.currentTarget === e.target) {
            domRef()?.focus()
          }
        },
        style: {
          cursor: 'text',
        },
      },
      hoverProps,
      props,
      {
        ref: mergeRefs(local.wrapperRef ?? ref, setInputWrapperRef),
      },
    )
  }

  const getInnerWrapperProps: PropGetter = (props = {}, ref) => {
    return mergeProps(props, {
      ref: mergeRefs(local.innerWrapperRef ?? ref, setInnerWrapperRef),
      'data-slot': 'inner-wrapper',
      onClick: (e: MouseEvent) => {
        if (domRef() && e.currentTarget === e.target) {
          domRef()?.focus()
        }
      },
      get class() {
        return slots().innerWrapper({
          class: clsx(local.classes?.innerWrapper, props?.class),
        })
      },
    })
  }

  const getMainWrapperProps: PropGetter = (props = {}) => {
    return mergeProps(props, {
      'data-slot': 'main-wrapper',
      get class() {
        return slots().mainWrapper({
          class: clsx(local.classes?.mainWrapper, props?.class),
        })
      },
    })
  }

  const getHelperWrapperProps: PropGetter = (props = {}) => {
    return mergeProps(props, {
      'data-slot': 'helper-wrapper',
      get class() {
        return slots().helperWrapper({
          class: clsx(local.classes?.helperWrapper, props?.class),
        })
      },
    })
  }

  const getDescriptionProps: PropGetter = (props = {}) => {
    return mergeProps(props, descriptionProps, {
      'data-slot': 'description',
      get class() {
        return slots().description({
          class: clsx(local.classes?.description, props?.class),
        })
      },
    })
  }

  const getErrorMessageProps: PropGetter = (props = {}) => {
    return mergeProps(props, errorMessageProps, {
      'data-slot': 'error-message',
      get class() {
        return slots().errorMessage({
          class: clsx(local.classes?.errorMessage, props?.class),
        })
      },
    })
  }

  const getClearButtonProps: PropGetter = (props = {}) => {
    return mergeProps(
      props,
      {
        role: 'button',
        tabIndex: 0,
        'data-slot': 'clear-button',
        get 'data-focus-visible'() {
          return dataAttr(isClearButtonFocusVisible)
        },
        get class() {
          return slots().clearButton({
            class: clsx(local.classes?.clearButton, props?.class),
          })
        },
      },
      clearPressProps,
      clearFocusProps,
    )
  }

  return {
    Component,
    properties,
    domRef,
    baseDomRef,
    inputWrapperRef,
    innerWrapperRef,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInputWrapperProps,
    getInnerWrapperProps,
    getMainWrapperProps,
    getHelperWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  }
}

export type UseTextfieldReturn = ReturnType<typeof useTextfield>
