import { createContext } from '@saftox-ui/solid-utils/create/create-context'

export type ProviderContextProps = {
  /**
   * Whether to disable animations in the whole application.
   *
   * @default false
   */
  disableAnimation?: boolean
  /**
   * Whether to use native HTML form validation to prevent form submission
   * when the value is missing or invalid, or mark the field as required
   * or invalid via ARIA.
   * @see https://react-spectrum.adobe.com/react-aria/forms.html
   *
   * @default "aria"
   */
  validationBehavior?: 'aria' | 'native'
}

export const [createProviderContext, useProviderContext] = createContext<ProviderContextProps>({
  name: 'provider-context',
  strict: false,
})
