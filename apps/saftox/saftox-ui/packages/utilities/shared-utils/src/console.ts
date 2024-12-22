const issuedWarnings: { [key: string]: boolean } = {}

export function issueWarning(message: string, component?: string, ...additionalInfo: any[]) {
  const componentTag = component ? `[${component}]` : ' '
  const formattedMessage = `[Saftox UI]${componentTag}: ${message}`

  if (typeof console === 'undefined') {
    return
  }

  if (issuedWarnings[formattedMessage]) {
    return
  }

  issuedWarnings[formattedMessage] = true

  if (process?.env?.NODE_ENV !== 'production') {
    console.warn(formattedMessage, additionalInfo)
  }
}
