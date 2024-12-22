import { render } from 'solid-js/web'
import { User } from '../src'

const App = () => {
  return (
    <>
      <User>
        <span>Hello Solid</span>
      </User>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
