import type { ItemKey } from './collection'
import type { MaybeAccessor } from '@solid-primitives/utils'

export interface SingleSelection {
  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>

  /** The currently selected key in the collection (controlled). */
  selectedKey?: MaybeAccessor<ItemKey | undefined>

  /** The initial selected key in the collection (uncontrolled). */
  defaultSelectedKey?: MaybeAccessor<ItemKey | undefined>

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: ItemKey) => any
}

export type SelectionMode = 'none' | 'single' | 'multiple'
export type SelectionBehavior = 'toggle' | 'replace'
export type SelectionType = 'all' | Iterable<ItemKey>

export interface MultipleSelection {
  /** The type of selection that is allowed in the collection. */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>

  /** Whether the collection allows empty selection. */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>

  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: MaybeAccessor<'all' | Iterable<ItemKey> | undefined>

  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: MaybeAccessor<'all' | Iterable<ItemKey> | undefined>

  /** Handler that is called when the selection changes. */
  onSelectionChange?: (keys: SelectionType) => any

  /** The currently disabled keys in the collection (controlled). */
  disabledKeys?: MaybeAccessor<Iterable<ItemKey> | undefined>
}

export type FocusStrategy = 'first' | 'last'
export type DisabledBehavior = 'selection' | 'all'
