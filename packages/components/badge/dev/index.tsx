import { render } from 'solid-js/web'
import { Badge } from '../src'

const App = () => {
  return (
    <>
      <Badge>
        <span>Hello Solid</span>
      </Badge>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
