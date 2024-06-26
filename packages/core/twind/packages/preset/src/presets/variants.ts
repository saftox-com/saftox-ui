import type { SaftoxTheme } from '../types/types'
import type {
  AutocompleteItem,
  AutocompleteProvider,
  Variant,
  VariantResolver,
} from '@saftox-ui/twind'

import { arbitrary, normalize, withAutocomplete } from '@saftox-ui/twind'

const __DEV__ = process.env.NODE_ENV !== 'production'

function withAutocomplete$(
  rule: VariantResolver<SaftoxTheme>,
  autocomplete: AutocompleteProvider<SaftoxTheme> | false,
): VariantResolver<SaftoxTheme> {
  if (__DEV__) {
    return withAutocomplete(rule, autocomplete)
  }

  return rule
}

const variants: Variant<SaftoxTheme>[] = [
  ['sticky', '@supports ((position: -webkit-sticky) or (position:sticky))'],
  ['motion-reduce', '@media (prefers-reduced-motion:reduce)'],
  ['motion-safe', '@media (prefers-reduced-motion:no-preference)'],
  ['print', '@media print'],
  ['(portrait|landscape)', ({ 1: $1 }) => `@media (orientation:${$1})`],
  ['contrast-(more|less)', ({ 1: $1 }) => `@media (prefers-contrast:${$1})`],

  ['(first-(letter|line)|placeholder|backdrop|before|after)', ({ 1: $1 }) => `&::${$1}`],
  ['(marker|selection)', ({ 1: $1 }) => `& *::${$1},&::${$1}`],
  ['file', '&::file-selector-button'],

  ['(first|last|only)', ({ 1: $1 }) => `&:${$1}-child`],
  ['even', '&:nth-child(2n)'],
  ['odd', '&:nth-child(odd)'],

  ['open', '&[open]'],
  ['opened', '&[data-opened]'],
  ['active', '&[data-active], &:active'],
  ['disabled', '&[data-loading], &[data-disabled], &[disabled]'],
  ['selected', '&[data-selected]'],
  ['focus-visible', '&[data-focus-visible], &:focus-visible'],

  // All other pseudo classes are already supported by twind

  [
    '(aria|data)-',
    withAutocomplete$(
      ({ 1: $1 /* aria or data */, $$ /* everything after the dash */ }, context) =>
        $$ &&
        `&[${$1}-${
          // aria-asc or data-checked -> from theme
          context.theme($1 as 'aria' | 'data', $$) ||
          // aria-[...] or data-[...]
          arbitrary($$, '', context) ||
          // default handling
          `${$$}="true"`
        }]`,
      __DEV__ &&
        (({ 1: $1 }, { theme }) =>
          [
            ...new Set([
              ...($1 === 'aria'
                ? [
                    'checked',
                    'disabled',
                    'expanded',
                    'hidden',
                    'pressed',
                    'readonly',
                    'required',
                    'selected',
                  ]
                : []),
              ...Object.keys(theme($1 as 'aria' | 'data') || {}),
            ]),
          ]
            .map(
              (key): AutocompleteItem => ({
                suffix: key,
                label: `&[${$1}-${theme($1 as string, key) || `${key}="true"`}]`,
                theme: { section: $1 as string, key },
              }),
            )
            .concat([{ suffix: '[', label: `&[${$1}-…]` }])),
    ),
  ],

  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    '((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?',
    withAutocomplete$(
      ({ 2: type, 3: name = '', 4: $4, 5: $5 = '', 6: label = name }, { e, h, v }) => {
        const selector =
          normalize($5) ||
          (($4?.[0] === '[' ? $4 : (v(($4 as string).slice(1)) as string)) as string)

        return `${(selector.includes('&') ? selector : `&${selector}`).replace(
          /&/g,
          `:merge(.${e(h(type + label))})`,
        )}${type?.[0] === 'p' ? '~' : ' '}&`
      },
      __DEV__ &&
        ((_, { variants }) =>
          Object.entries(variants)
            .filter(([, selector]) => /^&(\[|:[^:])/.test(selector))
            .flatMap(([variant, selector]): AutocompleteItem[] => [
              {
                prefix: 'group-',
                suffix: variant,
                label: `${selector.replace('&', '.group')} &`,
                modifiers: [],
              },
              {
                prefix: 'peer-',
                suffix: variant,
                label: `${selector.replace('&', '.peer')} &`,
                modifiers: [],
              },
            ])),
    ),
  ],

  // direction variants
  [
    '(ltr|rtl)',
    withAutocomplete$(
      ({ 1: $1 }) => `[dir="${$1}"] &`,
      __DEV__ && (({ 1: $1 }) => [{ prefix: $1, suffix: '', label: `[dir="${$1}"] &` }]),
    ),
  ],

  [
    'supports-',
    withAutocomplete$(
      ({ $$ /* everything after the dash */ }, context) => {
        $$ &&= (context.theme('supports', $$) || arbitrary($$, '', context)) as string

        if ($$) {
          if (!$$.includes(':')) {
            $$ += ':var(--tw)'
          }

          if (!/^\w*\s*\(/.test($$)) {
            $$ = `(${$$})`
          }

          // Chrome has a bug where `(condtion1)or(condition2)` is not valid
          // But `(condition1) or (condition2)` is supported.
          return `@supports ${$$.replace(/\b(and|or|not)\b/g, ' $1 ').trim()}`
        }
      },
      __DEV__ &&
        ((_, { theme }) =>
          Object.keys(theme('supports') || {})
            .map(
              (key): AutocompleteItem => ({
                suffix: key,
                theme: { section: 'supports', key },
              }),
            )
            .concat([{ suffix: '[', label: '@supports …' }])),
    ),
  ],

  [
    'max-',
    withAutocomplete$(
      ({ $$ }, context) => {
        $$ &&= (context.theme('screens', $$) || arbitrary($$, '', context)) as string
        if (typeof $$ === 'string') {
          return `@media not all and (min-width:${$$})`
        }
      },
      __DEV__ &&
        ((_, { theme }) =>
          Object.entries(theme('screens') || {})
            .filter(([, value]) => typeof value === 'string')
            .map(
              ([key, value]): AutocompleteItem => ({
                suffix: key,
                label: `@media not all and (min-width:${value})`,
                theme: { section: 'screens', key },
              }),
            )
            .concat([{ suffix: '[', label: '@media not all and (min-width: …)' }])),
    ),
  ],

  [
    'min-',
    withAutocomplete$(
      ({ $$ }, context) => {
        $$ &&= arbitrary($$, '', context) as string

        return $$ && `@media (min-width:${$$})`
      },
      __DEV__ && (() => [{ suffix: '[', label: '@media (min-width: …)' }]),
    ),
  ],

  // Arbitrary variants
  [
    /^\[(.+)]$/,
    ({ 1: $1 }) =>
      /[&@]/.test($1 as string) &&
      normalize($1 as string)
        .replace(/[}]+$/, '')
        .split('{'),
  ],
]

export default variants
