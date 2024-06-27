import type { Meta, StoryObj } from '@saftox-ui/storybook-solid'
import type { CheckboxGroupProps } from '../src'

import { CloseIcon } from '@saftox-ui/shared-icons'
import { button, checkbox } from '@saftox-ui/theme'
import { createEffect, createSignal } from 'solid-js'

import { Checkbox, CheckboxGroup } from '../src'

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
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

const defaultProps = {
  ...checkbox.defaultVariants,
}

const Template = (args: CheckboxGroupProps) => (
  <CheckboxGroup {...args}>
    <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
    <Checkbox value="sydney">Sydney</Checkbox>
    <Checkbox value="san-francisco">San Francisco</Checkbox>
    <Checkbox value="london">London</Checkbox>
    <Checkbox value="tokyo">Tokyo</Checkbox>
  </CheckboxGroup>
)

const InvalidTemplate = (args: CheckboxGroupProps) => {
  const [isInvalid, setIsInvalid] = createSignal(true)

  return (
    <>
      <CheckboxGroup
        {...args}
        // isRequired
        // description="Select the cities you want to visit"
        isInvalid={isInvalid()}
        label="Select cities"
        onValueChange={(value) => {
          setIsInvalid(value.length < 1)
        }}
      >
        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="san-francisco">San Francisco</Checkbox>
        <Checkbox value="london">London</Checkbox>
        <Checkbox value="tokyo">Tokyo</Checkbox>
      </CheckboxGroup>
    </>
  )
}

const FormTemplate = (args: CheckboxGroupProps) => {
  return (
    <form
      class="flex flex-col items-start gap-4"
      onSubmit={(e) => {
        const formData = new FormData(e.currentTarget)
        const selectedCities = formData.getAll('favorite-cities')

        alert(`Submitted values: ${selectedCities.join(', ')}`)
        e.preventDefault()
      }}
    >
      <CheckboxGroup {...args} label="Select cities" name="favorite-cities">
        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="san-francisco">San Francisco</Checkbox>
        <Checkbox value="london">London</Checkbox>
        <Checkbox value="tokyo">Tokyo</Checkbox>
      </CheckboxGroup>
      <button class={button({ color: 'primary' }).base()} type="submit">
        Submit
      </button>
    </form>
  )
}

const ControlledTemplate = (args: CheckboxGroupProps) => {
  const [selected, setSelected] = createSignal<string[]>(['buenos-aires'])

  createEffect(() => {
    console.log('Checkbox ', selected())
  })

  return (
    <div class="flex flex-col gap-2">
      <CheckboxGroup {...args} label="Select cities" value={selected()} onValueChange={setSelected}>
        <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
        <Checkbox value="sydney">Sydney</Checkbox>
        <Checkbox value="san-francisco">San Francisco</Checkbox>
        <Checkbox value="london">London</Checkbox>
        <Checkbox value="tokyo">Tokyo</Checkbox>
      </CheckboxGroup>
      <p class="text-default-500">Selected: {selected().join(', ')}</p>
    </div>
  )
}

export const Default = {
  render: Template,

  args: {
    ...defaultProps,
  },
}

export const WithLabel = {
  render: Template,

  args: {
    label: 'Select cities',
  },
}

export const DefaultValue = {
  render: Template,

  args: {
    ...defaultProps,
    label: 'Select cities',
    defaultValue: ['buenos-aires', 'london'],
  },
}

export const Controlled = {
  render: ControlledTemplate,

  args: {
    ...defaultProps,
  },
}

export const Horizontal = {
  render: Template,

  args: {
    label: 'Select cities',
    orientation: 'horizontal',
  },
}

export const IsDisabled = {
  render: Template,

  args: {
    label: 'Select cities',
    isDisabled: true,
  },
}

export const LineThrough = {
  render: Template,

  args: {
    label: 'Select cities',
    lineThrough: true,
  },
}

export const WithDescription = {
  render: Template,

  args: {
    ...defaultProps,
    description: 'Select the cities you want to visit',
  },
}

export const IsInvalid = {
  render: InvalidTemplate,

  args: {
    ...defaultProps,
  },
}

export const WithErrorMessage = {
  render: Template,

  args: {
    ...defaultProps,
    isInvalid: true,
    errorMessage: 'The selected cities cannot be visited at the same time',
  },
}

export const WithErrorMessageFunction = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
    errorMessage: (value: any) => {
      if (value.validationDetails.valueMissing) {
        return 'At least one option must be selected'
      }
    },
  },
}

export const WithValidation = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    description: 'Please select at least 2 options',
    validate: (value: string[]) => {
      if (value.length < 2) {
        return 'You must select at least 2 options'
      }

      return null
    },
  },
}

export const DisableAnimation = {
  render: Template,

  args: {
    label: 'Select cities',
    disableAnimation: true,
  },
}

export const IsRequired = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
  },
}
