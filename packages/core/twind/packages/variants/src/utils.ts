export const falsyToString = <T>(value: T): string | T =>
  typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value

export const isEmptyObject = <T>(obj: T | undefined): boolean =>
  !obj || typeof obj !== 'object' || Object.keys(obj).length === 0

export const isEqual = (
  obj1: Record<string, any> | undefined,
  obj2: Record<string, any> | undefined,
) => JSON.stringify(obj1) === JSON.stringify(obj2)

export const isBoolean = (value: boolean) => typeof value === 'boolean'

function flat(arr: any[], target: any[] = []) {
  for (const el of arr) {
    if (Array.isArray(el)) flat(el, target)
    else target.push(el)
  }
}

export function flatArray(arr: any[]) {
  const flattened: any[] | undefined = []

  flat(arr, flattened)

  return flattened
}

type MergeUnionOfRecordTypes<U extends Record<string, unknown>> = {
  [K in U extends unknown ? keyof U : never]: U extends unknown
    ? K extends keyof U
      ? U[K]
      : never
    : never
}

export const flatMergeArrays = (...arrays: any[]) => flatArray(arrays).filter(Boolean)

export const mergeObjects = <T extends Record<string, any>, U extends Record<string, any>>(
  obj1: T,
  obj2: U,
) => {
  const result: Record<string, any> = {}
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  for (const key of keys1) {
    if (keys2.includes(key)) {
      const val1 = obj1[key]
      const val2 = obj2[key]

      if (Array.isArray(val1) || Array.isArray(val2)) {
        result[key] = flatMergeArrays(val2, val1)
      } else if (typeof val1 === 'object' && typeof val2 === 'object') {
        result[key] = mergeObjects(val1, val2)
      } else {
        result[key] = `${val2} ${val1}`
      }
    } else {
      result[key] = obj1[key]
    }
  }

  for (const key of keys2) {
    if (!keys1.includes(key)) {
      result[key] = obj2[key]
    }
  }

  return result
}

export const removeExtraSpaces = (str: string) => {
  if (!str || typeof str !== 'string') {
    return str
  }

  return str.replace(/\s+/g, ' ').trim()
}

export const voidEmpty = <T>(value: T): T | undefined => (value ? value : undefined)
