type EventHandlerEvent<T, E extends Event> = E & {
  currentTarget: T
  target: Element
}

type Ref<T = HTMLElement> = T | ((el: T) => void) | undefined

export type { EventHandlerEvent, Ref }
