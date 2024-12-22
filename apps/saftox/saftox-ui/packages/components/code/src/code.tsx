import type { CodeProps } from './code-types'
import type { Component } from 'solid-js'

import { useCode } from './use-code'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

const Code: Component<CodeProps> = (props) => {
  const { Component, getCodeProps } = useCode(props)

  return (
    <Dynamic as={Component} {...getCodeProps()}>
      {props.children}
    </Dynamic>
  )
}

export default Code
