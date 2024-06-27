import type { Meta, StoryObj } from '@saftox-ui/storybook-solid'
import type { CheckboxIconProps, CheckboxProps } from '../src'

import { CloseIcon } from '@saftox-ui/shared-icons'
import { button, checkbox } from '@saftox-ui/theme'
import { For, createEffect, createSignal } from 'solid-js'

import { Checkbox } from '../src'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    radius: {
      control: {
        type: 'select',
      },
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
    },
    lineThrough: {
      control: {
        type: 'boolean',
      },
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
    validationBehavior: {
      control: {
        type: 'select',
      },
      options: ['aria', 'native'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Checkbox>

const defaultProps: CheckboxProps = {
  ...checkbox.defaultVariants,
  children: 'Option',
}

const ControlledTemplate = (args: CheckboxProps) => {
  const [selected, setSelected] = createSignal<boolean>(true)

  createEffect(() => {
    console.log('Checkbox ', selected())
  })

  return (
    <div class="flex flex-col gap-2">
      <Checkbox isSelected={selected()} onValueChange={setSelected} {...args}>
        Subscribe (controlled)
      </Checkbox>
      <p class="text-default-500">Selected: {selected() ? 'true' : 'false'}</p>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => setSelected(!selected())}>Toggle</button>
    </div>
  )
}

const FormTemplate = (args: CheckboxProps) => {
  return (
    <form
      class="flex flex-col items-start gap-4"
      onSubmit={(e: Event) => {
        e.preventDefault()
        const checkbox = e.target as HTMLInputElement

        if (checkbox.checked) {
          alert(`Submitted value: ${checkbox.value}`)
        } else {
          alert('Checkbox is not checked')
        }
      }}
    >
      <Checkbox name="check" value="checked" {...args}>
        Check
      </Checkbox>
      <button class={button({ color: 'primary' }).base()} type="submit">
        Submit
      </button>
    </form>
  )
}

const GroupTemplate = (args: CheckboxProps) => {
  const items = ['Apple', 'Banana', 'Orange', 'Mango']

  const [selectedItems, setSelectedItems] = createSignal<string[]>([])

  const isSelected = (value: string) => {
    return selectedItems().some((selected) => selected === value)
  }

  const handleValueChange = (value: string) => {
    setSelectedItems([value])
  }

  return (
    <div class="text-white flex flex-col gap-2">
      <h2>List of Fruits</h2>

      <For each={items}>
        {(item, index) => (
          <Checkbox
            {...args}
            class="text-white"
            color="primary"
            isSelected={isSelected(item)}
            onValueChange={() => handleValueChange(item)}
          >
            {item} {isSelected(item) ? '/ state: true' : '/ state: false'}
          </Checkbox>
        )}
      </For>
    </div>
  )
}

export const Default = {
  args: {
    ...defaultProps,
  },
}

export const IsDisabled = {
  args: {
    ...defaultProps,
    isDisabled: true,
  },
}

export const DefaultSelected = {
  args: {
    ...defaultProps,
    defaultSelected: true,
  },
}

export const CustomIconNode = {
  args: {
    ...defaultProps,
    icon: CloseIcon,
  },
}

export const Group = {
  render: GroupTemplate,

  args: {
    ...defaultProps,
  },
}

export const CustomIconFunction = {
  args: {
    ...defaultProps,
    icon: (props: CheckboxIconProps) => <CloseIcon {...props} />,
  },
}

export const AlwaysSelected = {
  args: {
    ...defaultProps,
    isSelected: true,
  },
}

export const IsIndeterminate = {
  args: {
    ...defaultProps,
    isIndeterminate: true,
  },
}

export const LineThrough = {
  args: {
    ...defaultProps,
    lineThrough: true,
  },
}

export const DisableAnimation = {
  args: {
    ...defaultProps,
    disableAnimation: true,
  },
}

export const Controlled = {
  render: ControlledTemplate,

  args: {
    ...defaultProps,
  },
}

export const Required = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
  },
}
