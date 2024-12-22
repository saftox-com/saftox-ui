import type { Meta, StoryObj } from '@saftox-ui/storybook-solid'
import type { RadioProps, RadioGroupProps } from '../src'
import type { ValidationResult } from '@saftox-ui/types'

import { splitProps, createSignal, createEffect, Show } from 'solid-js'
import { radio, button } from '@saftox-ui/theme'
import { clsx } from '@saftox-ui/shared-utils'

import { createVisuallyHidden } from '@saftox-ui/visually-hidden'

import { RadioGroup, Radio, useRadio, useRadioGroupContext } from '../src'

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  onChange: { action: 'changed' },
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
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
} as Meta<typeof RadioGroup>

const defaultProps = {
  ...radio.defaultVariants,
  label: 'Options',
}

const Template = (args: RadioGroupProps) => {
  const radioProps = args.description
    ? {
        a: {
          description: 'Description for Option A',
        },
        b: {
          description: 'Description for Option B',
        },
        c: {
          description: 'Description for Option C',
        },
        d: {
          description: 'Description for Option D',
        },
      }
    : {
        a: {},
        b: {},
        c: {},
        d: {},
      }

  const items = () => (
    <>
      <Radio value="A" {...radioProps.a}>
        Option A
      </Radio>
      <Radio value="B" {...radioProps.b}>
        Option B
      </Radio>
      <Radio value="C" {...radioProps.c}>
        Option C
      </Radio>
      <Radio value="D" {...radioProps.d}>
        Option D
      </Radio>
    </>
  )

  return args.isRequired ? (
    <form
      class="flex flex-col items-start gap-4"
      onSubmit={(e) => {
        alert(
          `Submitted value: ${
            (
              e.target as HTMLInputElement & {
                sample: HTMLInputElement
              }
            ).sample.value
          }`,
        )
        e.preventDefault()
      }}
    >
      <RadioGroup {...args} name="sample">
        {items()}
      </RadioGroup>
      <button class={button({ color: 'primary' }).base()} type="submit">
        Submit
      </button>
    </form>
  ) : (
    <RadioGroup {...args}>{items()}</RadioGroup>
  )
}

const InvalidTemplate = (args: RadioGroupProps) => {
  const [isInvalid, setIsInvalid] = createSignal<boolean>(true)

  const radioProps = args.description
    ? {
        a: {
          description: 'Description for Option A',
        },
        b: {
          description: 'Description for Option B',
        },
        c: {
          description: 'Description for Option C',
        },
        d: {
          description: 'Description for Option D',
        },
      }
    : {
        a: {},
        b: {},
        c: {},
        d: {},
      }

  const items = (
    <>
      <Radio value="A" {...radioProps.a}>
        Option A (Invalid)
      </Radio>
      <Radio value="B" {...radioProps.b}>
        Option B (Valid)
      </Radio>
      <Radio value="C" {...radioProps.c}>
        Option C (Valid)
      </Radio>
      <Radio value="D" {...radioProps.d}>
        Option D (Invalid)
      </Radio>
    </>
  )

  const validOptions = ['C', 'B']

  return args.isRequired ? (
    <form
      class="flex flex-col items-start gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        alert('Submitted!')
      }}
    >
      <RadioGroup
        {...args}
        isInvalid={isInvalid()}
        onValueChange={(value) => setIsInvalid(!validOptions.includes(value))}
      >
        {items}
      </RadioGroup>
      <button class={button({ color: 'primary' }).base()} type="submit">
        Submit
      </button>
    </form>
  ) : (
    <RadioGroup {...args}>{items}</RadioGroup>
  )
}

const ControlledTemplate = (args: RadioGroupProps) => {
  const [selectedItem, setSelectedItem] = createSignal<string>('london')

  createEffect(() => {
    console.log('isSelected:', selectedItem)
  })

  return (
    <div class="flex flex-col gap-2">
      <RadioGroup
        label="Select city"
        value={selectedItem()}
        onValueChange={setSelectedItem}
        {...args}
      >
        <Radio value="buenos-aires">Buenos Aires</Radio>
        <Radio value="sydney">Sydney</Radio>
        <Radio value="london">London</Radio>
        <Radio value="tokyo">Tokyo</Radio>
      </RadioGroup>
      <p class="text-default-500">Selected: {selectedItem()}</p>
    </div>
  )
}

export const Default = {
  render: Template,

  args: {
    ...defaultProps,
  },
}

export const IsDisabled = {
  render: Template,

  args: {
    ...defaultProps,
    isDisabled: true,
  },
}

export const DefaultChecked = {
  render: Template,

  args: {
    ...defaultProps,
    defaultValue: 'C',
  },
}

export const IsRequired = {
  render: Template,

  args: {
    ...defaultProps,
    isRequired: true,
  },
}

export const WithDescription = {
  render: Template,

  args: {
    ...defaultProps,
    description: 'Please select an option',
  },
}

export const IsInvalid = {
  render: InvalidTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
    description: 'Please select an option',
  },
}

export const WithErrorMessage = {
  render: Template,

  args: {
    ...defaultProps,
    isRequired: true,
    isInvalid: true,
    errorMessage: 'The selected option is invalid',
  },
}

export const WithErrorMessageFunction = {
  render: Template,

  args: {
    ...defaultProps,
    isRequired: true,
    errorMessage: (value: ValidationResult) => {
      if (value.validationDetails.valueMissing) {
        return 'Please select an option'
      }
    },
  },
}

export const WithValidation = {
  render: Template,

  args: {
    ...defaultProps,
    isRequired: true,
    description: 'Please select an option',
    validate: (value: string) => {
      if (value === 'A') {
        return 'Option A is not allowed'
      }
    },
  },
}

export const Row = {
  render: Template,

  args: {
    ...defaultProps,
    orientation: 'horizontal',
  },
}

export const DisableAnimation = {
  render: Template,

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

const CustomRadio = (props: RadioProps) => {
  const [local, rest] = splitProps(props, ['children'])

  const { groupState } = useRadioGroupContext()

  const isSelected = () => groupState.states.selectedValue === props.value

  return (
    <Radio
      {...rest}
      classes={{
        base: clsx(
          'inline-flex bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent',
          {
            'border-primary': isSelected,
          },
        ),
      }}
    >
      {props.children}
    </Radio>
  )
}

export const CustomWithClassNames = () => {
  return (
    <RadioGroup label="Plans">
      <CustomRadio description="Up to 20 items" value="free">
        Free
      </CustomRadio>
      <CustomRadio description="Unlimited items. $10 per month." value="pro">
        Pro
      </CustomRadio>
      <CustomRadio description="24/7 support. Contact us for pricing." value="enterprise">
        Enterprise
      </CustomRadio>
    </RadioGroup>
  )
}

const RadioCard = (props: RadioProps) => {
  const {
    Component,
    radioStates,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props)

  const { visuallyHiddenProps } = createVisuallyHidden()

  return (
    <Component
      {...getBaseProps()}
      class={clsx(
        'group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4',
        {
          'border-primary': radioStates.isSelected,
        },
      )}
    >
      <span {...visuallyHiddenProps}>
        <input {...getInputProps()} />
      </span>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        <Show when={'children' in props}>
          <span {...getLabelProps()}>{props.children}</span>
        </Show>

        <Show when={'description' in props}>
          <span class={clsx('text-sm text-foreground opacity-70')}>{props.description}</span>
        </Show>
      </div>
    </Component>
  )
}

export const CustomWithHooks = () => {
  return (
    <RadioGroup label="Plans">
      <RadioCard description="Up to 20 items" value="free">
        Free
      </RadioCard>
      <RadioCard description="Unlimited items. $10 per month." value="pro">
        Pro
      </RadioCard>
      <RadioCard description="24/7 support. Contact us for pricing." value="enterprise">
        Enterprise
      </RadioCard>
    </RadioGroup>
  )
}
