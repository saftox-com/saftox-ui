import { doubleEntryConfig } from '../../../../../configs/tsup.config'

export default doubleEntryConfig({
  entries: [
    {
      name: 'index',
      entry: 'src/index.ts',
    },
  ],
})
