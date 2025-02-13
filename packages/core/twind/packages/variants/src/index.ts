import type {
  ClassValue,
  CnOptions,
  CnReturn,
  CreateTV,
  LegacyMergeConfig,
  MergeConfig,
  TVCompoundSlots,
  TVCompoundVariants,
  TVConfig,
  TVDefaultVariants,
  TVProps,
  TVReturnType,
  TVSlots,
  TVVariantKeys,
  TVVariants,
  TWMConfig,
} from './types'

import { extendTailwindMerge, twMerge as twMergeBase } from 'tailwind-merge'

import {
  falsyToString,
  flatArray,
  flatMergeArrays,
  isEmptyObject,
  isEqual,
  mergeObjects,
  removeExtraSpaces,
} from './utils'

export type * from './types'

export const defaultConfig: TVConfig = {
  twMerge: true,
  twMergeConfig: {},
  responsiveVariants: false,
}

export const voidEmpty = (value: string | undefined) => (value ? value : undefined)

export const cnBase = <T extends CnOptions>(...classes: T): CnReturn =>
  voidEmpty(flatArray(classes).filter(Boolean).join(' '))

let cachedTwMerge: any = null
let cachedTwMergeConfig: MergeConfig &
  LegacyMergeConfig & {
    extend?: any
  }
let didTwMergeConfigChange = false

export const cn =
  <T extends CnOptions>(...classes: T) =>
  (config: TWMConfig): CnReturn => {
    if (!config.twMerge) {
      return cnBase(classes)
    }

    if (!cachedTwMerge || didTwMergeConfigChange) {
      didTwMergeConfigChange = false
      cachedTwMerge = isEmptyObject(cachedTwMergeConfig)
        ? twMergeBase
        : extendTailwindMerge({
            ...cachedTwMergeConfig,
            extend: {
              // Support for legacy tailwind-merge config shape
              theme: cachedTwMergeConfig.theme,
              classGroups: cachedTwMergeConfig.classGroups,
              conflictingClassGroupModifiers: cachedTwMergeConfig.conflictingClassGroupModifiers,
              conflictingClassGroups: cachedTwMergeConfig.conflictingClassGroups,
              // Support for new tailwind-merge config shape
              ...cachedTwMergeConfig.extend,
            },
          })
    }

    return voidEmpty(cachedTwMerge(cnBase(classes)))
  }

const joinObjects = (obj1: any, obj2: any) => {
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      obj1[key] = cnBase(obj1[key], obj2[key])
    } else {
      obj1[key] = obj2[key]
    }
  }

  return obj1
}

export const tv = <
  V extends TVVariants<S, B, EV>,
  CV extends TVCompoundVariants<V, S, B, EV, ES>,
  DV extends TVDefaultVariants<V, S, EV, ES>,
  C extends TVConfig<V, EV>,
  B extends ClassValue = undefined,
  S extends TVSlots = undefined,
  // @ts-expect-error
  E extends TVReturnType = TVReturnType<
    V,
    S,
    B,
    C,
    // @ts-expect-error
    EV extends undefined ? {} : EV,
    // @ts-expect-error
    ES extends undefined ? {} : ES
  >,
  EV extends TVVariants<ES, B, E['variants'], ES> = E['variants'],
  ES extends TVSlots = E['slots'] extends TVSlots ? E['slots'] : undefined,
>(
  options: {
    extend?: E
    base?: B
    slots?: S
    variants?: V
    compoundVariants?: CV
    compoundSlots?: TVCompoundSlots<V, S, B>
    defaultVariants?: DV
  },
  configProp?: C,
): TVReturnType<V, S, B, C, EV, ES, E> => {
  const {
    extend = null,
    slots: slotProps = {},
    variants: variantsProps = {},
    compoundVariants: compoundVariantsProps = [],
    compoundSlots = [],
    defaultVariants: defaultVariantsProps = {},
  } = options

  const config = { ...defaultConfig, ...configProp }

  const base = extend?.base ? cnBase(extend.base, options?.base) : options?.base

  const variants: V =
    extend?.variants && !isEmptyObject(extend.variants)
      ? (mergeObjects(variantsProps, extend.variants) as V)
      : (variantsProps as V)

  const defaultVariants: DV =
    extend?.defaultVariants && !isEmptyObject(extend.defaultVariants)
      ? ({ ...extend.defaultVariants, ...defaultVariantsProps } as DV)
      : (defaultVariantsProps as DV)

  // save twMergeConfig to the cache
  if (!isEmptyObject(config.twMergeConfig) && !isEqual(config.twMergeConfig, cachedTwMergeConfig)) {
    didTwMergeConfigChange = true
    cachedTwMergeConfig = config.twMergeConfig || cachedTwMergeConfig
  }

  const isExtendedSlotsEmpty = isEmptyObject(extend?.slots)
  const componentSlots = !isEmptyObject(slotProps)
    ? {
        // add "base" to the slots object
        base: cnBase(options?.base, isExtendedSlotsEmpty && extend?.base),
        ...slotProps,
      }
    : {}

  // merge slots with the "extended" slots
  const slots = isExtendedSlotsEmpty
    ? (componentSlots as S)
    : (joinObjects(
        { ...extend?.slots },
        isEmptyObject(componentSlots) ? { base: options?.base } : componentSlots,
      ) as S)

  // merge compoundVariants with the "extended" compoundVariants
  const compoundVariants: CV = isEmptyObject(extend?.compoundVariants)
    ? (compoundVariantsProps as CV)
    : (flatMergeArrays(extend?.compoundVariants, compoundVariantsProps) as CV)

  const component: TVReturnType<V, S, B, C, EV, ES, E> = (props) => {
    if (isEmptyObject(variants) && isEmptyObject(slotProps) && isExtendedSlotsEmpty) {
      return cn(base, props?.class, props?.className)(config)
    }

    if (compoundVariants && !Array.isArray(compoundVariants)) {
      throw new TypeError(
        `The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`,
      )
    }

    if (compoundSlots && !Array.isArray(compoundSlots)) {
      throw new TypeError(
        `The "compoundSlots" prop must be an array. Received: ${typeof compoundSlots}`,
      )
    }

    const getScreenVariantValues = (
      screen: string,
      screenVariantValue: string | { [key: string]: any }[] | { [key: string]: any },
      acc: { [key: string]: any }[] & { [key: string]: any },
      slotKey: keyof S | string | null,
    ) => {
      let result = acc || []

      if (typeof screenVariantValue === 'string') {
        result = result.concat(
          removeExtraSpaces(screenVariantValue)
            .split(' ')
            .map((v: string) => `${screen}:${v}`),
        )
      } else if (Array.isArray(screenVariantValue)) {
        result = result.concat(
          screenVariantValue.reduce((acc: string[], v: string) => {
            return acc.concat(`${screen}:${v}`)
          }, []),
        )
      } else if (typeof screenVariantValue === 'object' && typeof slotKey === 'string') {
        for (const key in screenVariantValue) {
          if (Object.prototype.hasOwnProperty.call(screenVariantValue, key) && key === slotKey) {
            const value = screenVariantValue[key]

            if (value && typeof value === 'string') {
              const fixedValue = removeExtraSpaces(value)

              if (result[slotKey]) {
                result[slotKey] = result[slotKey].concat(
                  fixedValue.split(' ').map((v: string) => `${screen}:${v}`),
                )
              } else {
                result[slotKey] = fixedValue.split(' ').map((v: string) => `${screen}:${v}`)
              }
            } else if (Array.isArray(value) && value.length > 0) {
              result[slotKey] = value.reduce((acc: string[], v: string) => {
                return acc.concat(`${screen}:${v}`)
              }, [])
            }
          }
        }
      }

      return result
    }

    const getVariantValue = (
      variant: keyof V | string,
      vrs = variants,
      slotKey?: keyof S | string,
      slotProps?: TVProps<V, S, C, EV, ES>,
    ) => {
      const slotKeyDefault = slotKey || null
      const variantObj = vrs[variant]

      if (!variantObj || isEmptyObject(variantObj)) {
        return null
      }

      const variantProp = slotProps?.[variant] ?? props?.[variant]

      if (variantProp === null) return null

      const variantKey = falsyToString(variantProp)

      // responsive variants
      const responsiveVarsEnabled =
        (Array.isArray(config.responsiveVariants) && config.responsiveVariants.length > 0) ||
        config.responsiveVariants === true

      let defaultVariantProp = defaultVariants?.[variant]
      let screenValues: any = []

      if (typeof variantKey === 'object' && responsiveVarsEnabled) {
        for (const [screen, screenVariantKey] of Object.entries(variantKey)) {
          const screenVariantValue = variantObj[screenVariantKey]

          if (screen === 'initial') {
            defaultVariantProp = screenVariantKey
            continue
          }

          // if the screen is not in the responsiveVariants array, skip it
          if (
            Array.isArray(config.responsiveVariants) &&
            !config.responsiveVariants.includes(screen)
          ) {
            continue
          }

          screenValues = getScreenVariantValues(
            screen,
            screenVariantValue,
            screenValues,
            slotKeyDefault,
          )
        }
      }

      // If there is a variant key and it's not an object (screen variants),
      // we use the variant key and ignore the default variant.
      const key =
        variantKey != null && typeof variantKey !== 'object'
          ? (variantKey as V[keyof V])
          : (falsyToString(defaultVariantProp) as V[keyof V])

      const value = variantObj[key]

      if (
        typeof screenValues === 'object' &&
        typeof slotKey === 'string' &&
        screenValues[slotKey]
      ) {
        return joinObjects(screenValues, value)
      }

      if (screenValues.length > 0) {
        screenValues.push(value)

        return screenValues
      }

      return value
    }

    const getVariantClassNames = () => {
      if (!variants) {
        return null
      }

      return Object.keys(variants).map((vk) => getVariantValue(vk, variants))
    }

    const getVariantClassNamesBySlotKey = (
      slotKey: keyof S | string,
      slotProps: TVProps<V, S, C, EV, ES>,
    ) => {
      if (!variants || typeof variants !== 'object') {
        return null
      }

      const result = new Array()

      for (const variant in variants) {
        const variantValue = getVariantValue(variant, variants, slotKey, slotProps)

        const value =
          slotKey === 'base' && typeof variantValue === 'string'
            ? variantValue
            : variantValue?.[slotKey]

        if (value) {
          result[result.length] = value
        }
      }

      return result
    }

    const propsWithoutUndefined: any = {}

    for (const prop in props) {
      if (props[prop] !== undefined) {
        propsWithoutUndefined[prop] = props[prop]
      }
    }

    const getCompleteProps = (key: string, slotProps: TVProps<V, S, C, EV, ES> | null) => {
      const initialProp =
        typeof props?.[key] === 'object'
          ? {
              [key]: props[key]?.initial,
            }
          : {}

      return {
        ...defaultVariants,
        ...propsWithoutUndefined,
        ...initialProp,
        ...slotProps,
      }
    }

    const getCompoundVariantsValue = (cv: CV, slotProps?: TVProps<V, S, C, EV, ES>) => {
      const defaultCV = cv ?? []
      const defaultSlotProps = slotProps ?? null
      const result = []

      for (const {
        class: tvClass,
        className: tvClassName,
        ...compoundVariantOptions
      } of defaultCV) {
        let isValid = true

        for (const [key, value] of Object.entries(compoundVariantOptions)) {
          const completeProps = getCompleteProps(key, defaultSlotProps)

          if (Array.isArray(value)) {
            if (!value.includes(completeProps[key])) {
              isValid = false
              break
            }
          } else {
            if (completeProps[key] !== value) {
              isValid = false
              break
            }
          }
        }

        if (isValid) {
          tvClass && result.push(tvClass)
          tvClassName && result.push(tvClassName)
        }
      }

      return result
    }

    const getCompoundVariantClassNamesBySlot = (slotProps: TVProps<V, S, C, EV, ES>) => {
      const compoundClassNames = getCompoundVariantsValue(compoundVariants, slotProps)

      if (!Array.isArray(compoundClassNames)) {
        return compoundClassNames
      }

      const result = {} as any

      for (const className of compoundClassNames) {
        if (typeof className === 'string') {
          result.base = cn(result.base, className)(config)
        }

        if (typeof className === 'object') {
          for (const [slot, slotClassName] of Object.entries(className)) {
            result[slot] = cn(result[slot], slotClassName)(config)
          }
        }
      }
      return result
    }

    const getCompoundSlotClassNameBySlot = (slotProps: TVProps<V, S, C, EV, ES>) => {
      if (compoundSlots.length < 1) {
        return null
      }

      const result: any = {}

      for (const {
        slots = [],
        class: slotClass,
        className: slotClassName,
        ...slotVariants
      } of compoundSlots) {
        if (!isEmptyObject(slotVariants)) {
          let isValid = true

          for (const key of Object.keys(slotVariants)) {
            const completePropsValue = getCompleteProps(key, slotProps)[key]

            if (
              completePropsValue === undefined ||
              (Array.isArray(slotVariants[key])
                ? !slotVariants[key]?.includes(completePropsValue)
                : slotVariants[key] !== completePropsValue)
            ) {
              isValid = false
              break
            }
          }

          if (!isValid) {
            continue
          }
        }

        for (const slotName of slots) {
          result[slotName] = result[slotName] || []
          result[slotName].push([slotClass, slotClassName])
        }
      }

      return result
    }

    // with slots
    if (!isEmptyObject(slotProps) || !isExtendedSlotsEmpty) {
      const slotsFns: any = {}

      if (typeof slots === 'object' && !isEmptyObject(slots)) {
        for (const slotKey of Object.keys(slots)) {
          slotsFns[slotKey] = (slotProps: TVProps<V, S, C, EV, ES>) =>
            cn(
              slots[slotKey],
              getVariantClassNamesBySlotKey(slotKey, slotProps),
              (getCompoundVariantClassNamesBySlot(slotProps) ?? [])[slotKey],
              (getCompoundSlotClassNameBySlot(slotProps) ?? [])[slotKey],
              slotProps?.class,
              slotProps?.className,
            )(config)
        }
      }

      return slotsFns
    }

    // normal variants
    return cn(
      base,
      getVariantClassNames(),
      getCompoundVariantsValue(compoundVariants),
      props?.class,
      props?.className,
    )(config)
  }

  const getVariantKeys = () => {
    if (!variants || typeof variants !== 'object') return

    return Object.keys(variants)
  }

  component.variantKeys = getVariantKeys() as TVVariantKeys<V, S>
  component.extend = extend as E
  component.base = base as B
  component.slots = slots
  component.variants = variants
  component.defaultVariants = defaultVariants
  component.compoundSlots = compoundSlots
  component.compoundVariants = compoundVariants

  return component
}

export const createTV = <T extends TVConfig['responsiveVariants']>(
  configProp: TVConfig & T,
): CreateTV<T> => {
  return (options, config) => tv(options, config ? mergeObjects(configProp, config) : configProp)
}
