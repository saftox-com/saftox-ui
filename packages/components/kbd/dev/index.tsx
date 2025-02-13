import { render } from 'solid-js/web'
import { Kbd } from '../src'

const App = () => {
  return (
    <>
      <Kbd>
        <span>Hello Solid</span>
      </Kbd>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
