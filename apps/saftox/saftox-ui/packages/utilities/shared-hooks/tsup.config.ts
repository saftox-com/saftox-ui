import { doubleEntryConfig } from '../../../configs/tsup.config'

export default doubleEntryConfig({
  entries: [
    {
      name: 'index',
      entry: 'src/index.ts',
    },
    {
      name: 'to-value',
      entry: 'src/to-value/index.ts',
    },
    {
      name: 'try-on-cleanup',
      entry: 'src/try-on-cleanup/index.ts',
    },
    {
      name: 'use-debounce-fn',
      entry: 'src/use-debounce-fn/index.ts',
    },
    {
      name: 'use-throttle-fn',
      entry: 'src/use-throttle-fn/index.ts',
    },
    {
      name: 'use-timeout-fn',
      entry: 'src/use-timeout-fn/index.ts',
    },
  ],
})
