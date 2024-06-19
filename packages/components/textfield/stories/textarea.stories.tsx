import { type ComponentProps, type JSX, createSignal } from 'solid-js'
import type { Meta, StoryObj } from 'storybook-solidjs'

import { PlusFilledIcon, SendFilledIcon } from '@saftox-ui/shared-icons'
import { button, textfield } from '@saftox-ui/theme'

import { Textarea } from '../src'
import type { TextAreaProps } from '../src'

export default {
  title: 'Components/Textarea',
  component: Textarea,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['flat', 'faded', 'bordered', 'underlined'],
    },
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
    labelPlacement: {
      control: {
        type: 'select',
      },
      options: ['inside', 'outside', 'outside-left'],
    },
    disableAutosize: {
      control: {
        type: 'boolean',
      },
    },
    isDisabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  decorators: [
    (Story: any) => (
      <div class="flex items-center justify-center w-screen h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<ComponentProps<typeof Textarea>>

const defaultProps = {
  ...textfield.defaultVariants,
  disableAutosize: false,
  label: 'Description',
  placeholder: 'Enter your description',
}

const Template = (args: TextAreaProps) => (
  <div class="w-full max-w-[440px]">
    <Textarea {...args} />
  </div>
)

const ControlledTemplate = (args: TextAreaProps) => {
  const [value, setValue] = createSignal('')

  return (
    <div class="w-full  flex-col gap-2 max-w-[440px]">
      <Textarea {...args} value={value()} onValueChange={setValue} />
      <p class="text-default-500 text-small">Textarea value: {value()}</p>
    </div>
  )
}

const MinRowsTemplate = (args: TextAreaProps) => (
  <div class="w-full max-w-xl flex flex-row gap-4">
    <Textarea {...args} description="Default minRows is 3" />
    <Textarea {...args} description="minRows is 5" minRows={5} />
    <Textarea {...args} description="minRows is 10" minRows={10} />
  </div>
)

const MaxRowsTemplate = (args: TextAreaProps) => (
  <div class="w-full max-w-xl flex flex-row gap-4">
    <Textarea {...args} description="Default maxRows is 8" />
    <Textarea {...args} description="maxRows is 5" maxRows={5} />
    <Textarea {...args} description="maxRows is 3" maxRows={3} />
  </div>
)

const FormTemplate = (args: TextAreaProps) => (
  <form
    class="w-full max-w-xl flex flex-row items-end gap-4"
    onSubmit={(e) => {
      alert(
        `Submitted value: ${
          (
            e.target as HTMLInputElement & {
              example: HTMLInputElement
            }
          ).example.value
        }`,
      )
      e.preventDefault()
    }}
  >
    <div class="w-full max-w-[440px]">
      <Textarea name="textarea" {...args} />
    </div>

    <button class={button({ color: 'primary' }).base()} type="submit">
      Submit
    </button>
  </form>
)

export const Default = {
  render: Template,

  args: {
    ...defaultProps,
  },
}

export const FullRounded = {
  render: Template,

  args: {
    ...defaultProps,
    minRows: 1,
    label: null,
    classes: {
      input: 'py-1',
    },
    'aria-label': 'Description',
    placeholder: 'Enter your description',
    variant: 'bordered',
    radius: 'full',
  },
}

export const Required = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
  },
}

export const Disabled = {
  render: Template,

  args: {
    ...defaultProps,
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    variant: 'faded',
    isDisabled: true,
  },
}

export const ReadOnly = {
  render: Template,

  args: {
    ...defaultProps,
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    variant: 'bordered',
    isReadOnly: true,
  },
}

export const WithStartContent = {
  render: Template,

  args: {
    ...defaultProps,
    startContent: <PlusFilledIcon class="text-xl" />,
  },
}

export const WithEndContent = {
  render: Template,

  args: {
    ...defaultProps,
    minRows: 1,
    label: null,
    endContent: (
      <div class="p-1">
        <SendFilledIcon class="text-xl" />
      </div>
    ),
    classes: {
      input: 'py-1',
    },
    'aria-label': 'Description',
    placeholder: 'Enter your description',
    variant: 'bordered',
    radius: 'full',
  },
}

export const Controlled = {
  render: ControlledTemplate,

  args: {
    ...defaultProps,
  },
}

export const MinRows = {
  render: MinRowsTemplate,

  args: {
    ...defaultProps,
  },
}

export const MaxRows = {
  render: MaxRowsTemplate,

  args: {
    ...defaultProps,
    defaultValue:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec ultricies ultricies, nisl nisl aliquam nisl, eget tincidunt nunc nisl eget nisl. Nullam euismod, nisl nec',
  },
}

export const WithErrorMessage = {
  render: Template,

  args: {
    ...defaultProps,
    IsInvalid: true,
    errorMessage: 'Please enter a valid description',
  },
}

export const WithErrorMessageFunction = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    isRequired: true,
    minLength: '10',
    maxLength: '',
    label: 'Comment',
    placeholder: 'Enter your comment (10-100 characters)',
    errorMessage: (value: any) => {
      if (value.validationDetails.tooLong) {
        return 'Comment is too short. Min 10 characters.'
      }
      if (value.validationDetails.tooShort) {
        return 'Comment is too long. Max 100 characters.'
      }
      if (value.validationDetails.valueMissing) {
        return 'Comment is required'
      }
    },
  },
}

export const WithValidation = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    validate: (value: string) => {
      if (value.length < 10) {
        return 'Comment is too short. Min 10 characters.'
      }
      if (value.length > 100) {
        return 'Comment is too long. Max 100 characters.'
      }
    },
    isRequired: true,
    label: 'Comment',
    placeholder: 'Enter your comment (10-100 characters)',
  },
}

export const IsInvalid = {
  render: Template,

  args: {
    ...defaultProps,
    isInvalid: true,
    defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    errorMessage: 'Please enter a valid description',
  },
}
