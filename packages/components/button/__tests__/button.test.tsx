import { fireEvent, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'

import { Button } from '../src'

import { vitest } from 'vitest'

describe('Button', () => {
  it('should render correctly', () => {
    const wrapper = render(() => <Button />)

    expect(() => wrapper.unmount()).not.toThrow()
  })

  it('ref should be forwarded', () => {
    const [ref, setRef] = createSignal<HTMLButtonElement>()

    render(() => <Button ref={setRef} />)
    expect(ref()).not.toBeNull()
  })

  it('should trigger onPress function', async () => {
    const onPress = vitest.fn()
    render(() => <Button onPress={onPress}>Click</Button>)
    const button = screen.getByRole('button')

    fireEvent.click(button)

    expect(onPress).toHaveBeenCalled()
  })

  it('should ignore events when disabled', () => {
    const onPress = vitest.fn()
    const { getByRole } = render(() => <Button isDisabled onPress={onPress} />)

    fireEvent.click(getByRole('button'))

    expect(onPress).not.toHaveBeenCalled()
  })

  it('should renders with start icon', () => {
    const wrapper = render(() => (
      <Button startContent={<span data-testid="start-icon">Icon</span>}>Button</Button>
    ))

    expect(wrapper.getByTestId('start-icon')).toBeInTheDocument()
  })

  it('should renders with end icon', () => {
    const wrapper = render(() => (
      <Button endContent={<span data-testid="end-icon">Icon</span>}>Button</Button>
    ))

    expect(wrapper.getByTestId('end-icon')).toBeInTheDocument()
  })

  it('should have the proper type attribute', () => {
    const wrapper = render(() => <Button type="submit" />)

    expect(wrapper.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
