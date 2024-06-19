import type { UseSpacerProps } from './use-spacer'
import type { Component } from 'solid-js'

import { useSpacer } from './use-spacer'

import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

export interface SpacerProps extends UseSpacerProps {}

const Spacer: Component<SpacerProps> = (props) => {
  const { Component, getSpacerProps } = useSpacer(props)

  return <Dynamic as={Component} {...getSpacerProps()} />
}

export default Spacer
