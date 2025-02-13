import type { MaybeAccessor } from '@solid-primitives/utils'

export type ItemKey = string | number

export interface AsyncLoadable {
  /**
   * Whether the items are currently loading.
   */
  isLoading?: MaybeAccessor<boolean | undefined>

  /**
   * Handler that is called when more items should be loaded, e.g. while scrolling near the bottom.
   */
  onLoadMore?: () => any
}

export interface Expandable {
  /**
   * The currently expanded keys in the collection (controlled).
   */
  expandedKeys?: MaybeAccessor<Iterable<ItemKey> | undefined>

  /**
   * The initial expanded keys in the collection (uncontrolled).
   */
  defaultExpandedKeys?: MaybeAccessor<Iterable<ItemKey> | undefined>

  /**
   * Handler that is called when items are expanded or collapsed.
   */
  onExpandedChange?: (keys: Set<ItemKey>) => any
}

export interface KeyboardDelegate {
  /** Returns the key visually below the given one, or `undefined` for none. */
  getKeyBelow?(key: ItemKey): ItemKey | undefined

  /** Returns the key visually above the given one, or `undefined` for none. */
  getKeyAbove?(key: ItemKey): ItemKey | undefined

  /** Returns the key visually to the left of the given one, or `undefined` for none. */
  getKeyLeftOf?(key: ItemKey): ItemKey | undefined

  /** Returns the key visually to the right of the given one, or `undefined` for none. */
  getKeyRightOf?(key: ItemKey): ItemKey | undefined

  /** Returns the key visually one page below the given one, or `undefined` for none. */
  getKeyPageBelow?(key: ItemKey): ItemKey | undefined

  /** Returns the key visually one page above the given one, or `undefined` for none. */
  getKeyPageAbove?(key: ItemKey): ItemKey | undefined

  /** Returns the first key, or `undefined` for none. */
  getFirstKey?(key?: ItemKey, global?: boolean): ItemKey | undefined

  /** Returns the last key, or `undefined` for none. */
  getLastKey?(key?: ItemKey, global?: boolean): ItemKey | undefined

  /** Returns the next key after `fromKey` that matches the given search string, or `undefined` for none. */
  getKeyForSearch?(search: string, fromKey?: ItemKey): ItemKey | undefined
}
