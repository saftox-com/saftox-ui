import { render } from 'solid-js/web'
import { Radio } from '../src'

const App = () => {
  return (
    <>
      <Radio>
        <span>Hello Solid</span>
      </Radio>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
