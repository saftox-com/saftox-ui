import type { Component } from 'solid-js'
import type { CodeProps } from './code-types'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { useCode } from './use-code'

const Code: Component<CodeProps> = (props) => {
  const { Component, getCodeProps } = useCode(props)

  return (
    <Dynamic as={Component} {...getCodeProps()}>
      {props.children}
    </Dynamic>
  )
}

export default Code
