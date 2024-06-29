import { render } from 'solid-js/web'
import { Navbar } from '../src'

const App = () => {
  return (
    <>
      <Navbar>
        <span>Hello Solid</span>
      </Navbar>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
