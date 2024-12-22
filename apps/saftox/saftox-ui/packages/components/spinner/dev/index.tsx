import { render } from 'solid-js/web'
import { Spinner } from '../src'

const App = () => {
  return (
    <>
      <Spinner color="primary" />
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
