import type { AriaLabelingProps } from '@saftox-ui/types'
import type { Accessor } from 'solid-js'

import { isServer } from '@solid-primitives/utils'

import { createEffect, createSignal, on, onCleanup } from 'solid-js'

let descriptionId = 0
const descriptionNodes = new Map<string, { refCount: number; element: HTMLElement }>()

export function createDescription(description: Accessor<string | undefined>): AriaLabelingProps {
  const [id, setId] = createSignal<string>()

  createEffect(
    on(description, (newDescription) => {
      if (!newDescription || isServer) {
        return
      }

      let desc = descriptionNodes.get(newDescription)
      if (!desc) {
        const id = `saftox-ui-description-${descriptionId++}`
        setId(id)

        const node = document.createElement('div')
        node.id = id
        node.style.display = 'none'
        node.textContent = newDescription
        document.body.appendChild(node)
        desc = { refCount: 0, element: node }
        descriptionNodes.set(newDescription, desc)
      } else {
        setId(desc.element.id)
      }

      desc.refCount++
      onCleanup(() => {
        if (desc && --desc.refCount === 0) {
          desc.element.remove()
          descriptionNodes.delete(newDescription)
        }
      })
    }),
  )

  const descriptionProps: AriaLabelingProps = {
    get 'aria-describedby'() {
      return description() ? id() : undefined
    },
  }

  return descriptionProps
}
