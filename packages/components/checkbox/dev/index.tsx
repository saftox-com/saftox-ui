import { render } from 'solid-js/web'
import { Checkbox } from '../src'

const App = () => {
  return (
    <>
      <Checkbox>
        <span>Hello Solid</span>
      </Checkbox>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
