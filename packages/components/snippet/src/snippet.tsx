import type { SnippetProps } from './snippet-types'
import type { Component } from 'solid-js'

import { useSnippet } from './use-snippet'

import { For, Show } from 'solid-js'

import { Button } from '@saftox-ui/button'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'

const Snippet: Component<SnippetProps> = (props) => {
  const {
    Component,
    setPreRef,
    children,
    local,
    slots,
    symbolBefore,
    isMultiLine,
    getSnippetProps,
    getCopyButtonProps,
  } = useSnippet(props)

  const contents = () => {
    if (local.hideCopyButton) {
      return null
    }

    return (
      <Button {...getCopyButtonProps()}>
        <Show when={local.copyIcon}>
          <Dynamic as={local.copyIcon} class={slots().copyIcon()} />
        </Show>
        <Show when={local.checkIcon}>
          <Dynamic as={local.checkIcon} class={slots().checkIcon()} />
        </Show>
      </Button>
    )
  }

  const preContent = () => {
    if (isMultiLine() && children() && Array.isArray(children())) {
      return (
        <div class={slots().content({ class: local.classes?.content })}>
          <For each={children.toArray()}>
            {(t) => (
              <pre class={slots().pre({ class: local.classes?.pre })}>
                <Show when={!local.hideSymbol}>
                  <span class={slots().symbol({ class: local.classes?.symbol })}>
                    {symbolBefore()}
                  </span>
                </Show>

                {t}
              </pre>
            )}
          </For>
        </div>
      )
    }

    return (
      <pre ref={setPreRef} class={slots().pre({ class: local.classes?.pre })}>
        <Show when={!local.hideSymbol}>
          <span class={slots().symbol({ class: local.classes?.symbol })}>{symbolBefore()}</span>
        </Show>

        {children()}
      </pre>
    )
  }

  return (
    <>
      <Dynamic as={Component} {...getSnippetProps()}>
        {preContent()}
        {contents()}
      </Dynamic>
    </>
  )
}

export default Snippet
