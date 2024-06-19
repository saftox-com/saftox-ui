import { render } from 'solid-js/web'
import { Spacer } from '../src'

const App = () => {
  return (
    <>
      <Spacer>
        <span>Hello Solid</span>
      </Spacer>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
