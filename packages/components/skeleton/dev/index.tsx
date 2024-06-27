import { render } from 'solid-js/web'
import { Skeleton } from '../src'

const App = () => {
  return (
    <>
      <Skeleton>
        <span>Hello Solid</span>
      </Skeleton>
    </>
  )
}

render(() => <App />, document.getElementById('root')!)
