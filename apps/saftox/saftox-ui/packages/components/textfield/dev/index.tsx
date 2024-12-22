import { render } from 'solid-js/web'
import { Textfield } from '../src'

const App = () => {
  return <Textfield label="Name" name="name" />
}

render(() => <App />, document.getElementById('root')!)
