import type { ComponentProps, JSX } from 'solid-js'
import type { Meta, StoryObj } from 'storybook-solidjs'

import { Show, createMemo, createSignal } from 'solid-js'

import { Textfield, useTextfield } from '../src'
import type { TextfieldProps } from '../src/textfield'

import {
  CloseFilledIcon,
  EyeFilledIcon,
  EyeSlashFilledIcon,
  MailFilledIcon,
  SearchIcon,
} from '@saftox-ui/shared-icons'
import { button, textfield } from '@saftox-ui/theme'

import { createForm } from '@modular-forms/solid'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { combineProps } from '@saftox-ui/solid-utils/reactivity'

const meta = {
  title: 'Components/Textfield',
  component: Textfield,
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
} satisfies Meta<ComponentProps<typeof Textfield>>

export default meta
type Story = StoryObj<typeof meta>

const defaultProps = {
  ...textfield.defaultVariants,
  label: 'Email',
}
const Template = (args: TextfieldProps) => (
  <div class="w-full max-w-[240px]">
    <Textfield {...args} />
  </div>
)

const MirrorTemplate = (args: TextfieldProps) => (
  <div class="w-full max-w-xl flex flex-row items-end gap-4">
    <Textfield {...args} />
    <Textfield {...args} placeholder="Enter your email" />
  </div>
)

const FormTemplate = (args: TextfieldProps) => {
  const hangleSubmit: JSX.EventHandler<HTMLFormElement, Event> = (e) => {
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
  }
  return (
    <form class="w-full max-w-xl flex flex-row items-end gap-4" onsubmit={hangleSubmit}>
      <Textfield {...args} name="example" />
      <button class={button({ color: 'primary' }).base()} type="submit">
        Submit
      </button>
    </form>
  )
}
const PasswordTemplate = (args: TextfieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = createSignal(false)

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  return (
    <div class="w-full max-w-[240px]">
      <Textfield
        {...args}
        endContent={
          <button
            aria-label="show password"
            aria-pressed={isPasswordVisible()}
            type="button"
            onClick={togglePasswordVisibility}
          >
            <Show
              when={isPasswordVisible()}
              fallback={<EyeFilledIcon class="text-2xl text-default-400 pointer-events-none" />}
            >
              <EyeSlashFilledIcon class="text-2xl text-default-400 pointer-events-none" />
            </Show>
          </button>
        }
        type={isPasswordVisible() ? 'text' : 'password'}
      />
    </div>
  )
}

const RegexValidationTemplate = (args: TextfieldProps) => {
  const [value, setValue] = createSignal('')

  const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i)

  const validationState = () => {
    if (value() === '') return undefined

    return validateEmail(value()) ? 'valid' : 'invalid'
  }

  return (
    <div class="w-full max-w-[240px]">
      <Textfield
        {...args}
        errorMessage="Please enter a valid email"
        placeholder="Enter your email"
        validationState={validationState()}
        value={value()}
        onValueInput={setValue}
      />
    </div>
  )
}

const ControlledTemplate = (args: TextfieldProps) => {
  const [value, setValue] = createSignal('')

  return (
    <div class="w-full flex flex-col gap-2 max-w-[240px]">
      <Textfield {...args} placeholder="Enter your email" value={value()} onValueInput={setValue} />
      <p class="text-default-500 text-sm">Input value: {value()}</p>
    </div>
  )
}

const LabelPlacementTemplate = (args: TextfieldProps) => (
  <div class="w-full flex flex-col items-center gap-12">
    <div class="flex flex-col gap-3">
      <h3>Without placeholder</h3>
      <div class="w-full max-w-xl flex flex-row items-end gap-4">
        <Textfield {...args} description="inside" />
        <Textfield {...args} description="outside" labelPlacement="outside" />
        <Textfield {...args} description="outside-left" labelPlacement="outside-left" />
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <h3>With placeholder</h3>
      <div class="w-full max-w-xl flex flex-row items-end gap-4">
        <Textfield {...args} description="inside" placeholder="Enter your email" />
        <Textfield
          {...args}
          description="outside"
          labelPlacement="outside"
          placeholder="Enter your email"
        />
        <Textfield
          {...args}
          description="outside-left"
          labelPlacement="outside-left"
          placeholder="Enter your email"
        />
      </div>
    </div>
  </div>
)

const StartContentTemplate = (args: TextfieldProps) => (
  <div class="w-full max-w-xl flex flex-row items-end gap-4">
    <Textfield
      {...args}
      // placeholder="you@example.com"
      startContent={
        <MailFilledIcon class="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      }
    />
    <Textfield
      {...args}
      label="Price"
      placeholder="0.00"
      startContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">$</span>
        </div>
      }
      type="number"
    />
    <Textfield
      {...args}
      label="Website"
      placeholder="saftox.com"
      startContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">https://</span>
        </div>
      }
      type="url"
    />
  </div>
)

const EndContentTemplate = (args: TextfieldProps) => (
  <div class="w-full max-w-xl flex flex-row items-end gap-4">
    <Textfield
      {...args}
      endContent={
        <MailFilledIcon class="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
      }
      placeholder="you@example.com"
    />
    <Textfield
      {...args}
      endContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">$</span>
        </div>
      }
      label="Price"
      placeholder="0.00"
      type="number"
    />
    <Textfield
      {...args}
      endContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">.org/</span>
        </div>
      }
      label="Website"
      placeholder="nextui"
      type="url"
    />
  </div>
)

const StartAndEndContentTemplate = (args: TextfieldProps) => (
  <div class="w-full max-w-xs flex flex-col items-end gap-4">
    <Textfield
      {...args}
      endContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">@gmail.com</span>
        </div>
      }
      placeholder="nextui"
      startContent={
        <MailFilledIcon class="text-xl text-default-400 pointer-events-none flex-shrink-0" />
      }
    />
    <Textfield
      {...args}
      endContent={
        <div class="flex items-center">
          <label class="sr-only" html-for="currency">
            Currency
          </label>
          <select
            class="outline-none border-0 bg-transparent text-default-400 text-sm"
            id="currency"
            name="currency"
          >
            <option>USD</option>
            <option>ARS</option>
            <option>EUR</option>
          </select>
        </div>
      }
      label="Price"
      placeholder="0.00"
      startContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">$</span>
        </div>
      }
      type="number"
    />
    <Textfield
      {...args}
      endContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">.org</span>
        </div>
      }
      label="Website"
      placeholder="nextui"
      startContent={
        <div class="pointer-events-none flex items-center">
          <span class="text-default-400 text-sm">https://</span>
        </div>
      }
      type="url"
    />
  </div>
)

const InputTypesTemplate = (args: TextfieldProps) => (
  <div class="grid grid-cols-3 gap-4">
    <Textfield {...args} label="Text" placeholder="Enter your text" />
    <Textfield {...args} label="Number" placeholder="Enter your number" type="number" />
    <Textfield {...args} label="Password" placeholder="Enter your password" type="password" />
    <Textfield {...args} label="Email" placeholder="Enter your email" type="email" />
    <Textfield {...args} label="URL" placeholder="Enter your url" type="url" />
    <Textfield {...args} label="Search" placeholder="Enter your search" type="search" />
    <Textfield {...args} label="Tel" placeholder="Enter your phone" type="tel" />
    <Textfield {...args} label="Date" placeholder="Enter your date" type="date" />
    <Textfield {...args} label="Time" placeholder="Enter your time" type="time" />
    <Textfield {...args} label="Month" placeholder="Enter your month" type="month" />
    <Textfield {...args} label="Week" placeholder="Enter your week" type="week" />
    <Textfield {...args} label="Range" placeholder="Enter your range" type="range" />
  </div>
)

const CustomWithClassNamesTemplate = (args: TextfieldProps) => (
  <div class="w-full max-w-[340px]">
    <Textfield
      {...args}
      classes={{
        label: 'hidden',
        inputWrapper: [
          'bg-slate-100',
          'border',
          'shadow',
          'hover:bg-slate-200',
          'focus-within:!bg-slate-100',
          'dark:bg-slate-900',
          'dark:hover:bg-slate-800',
          'dark:border-slate-800',
          'dark:focus-within:!bg-slate-900',
        ],
        innerWrapper: 'gap-3',
        input: [
          'text-base',
          'text-slate-500',
          'placeholder:text-slate-500',
          'dark:text-slate-400',
          'dark:placeholder:text-slate-400',
        ],
      }}
      endContent={
        <div class="pointer-events-none flex items-center">
          <kbd class="font-sans font-semibold text-slate-400">
            <abbr class="no-underline" title="Command">
              ⌘
            </abbr>
            &nbsp;K
          </kbd>
        </div>
      }
      labelPlacement="outside"
      placeholder="Quick search..."
      startContent={<SearchIcon class="text-xl text-slate-400 pointer-events-none flex-shrink-0" />}
    />
  </div>
)

const CustomWithHooksTemplate = (props: TextfieldProps) => {
  const {
    Component,
    properties,
    domRef,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInnerWrapperProps,
    getInputWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  } = useTextfield(
    combineProps(props, {
      classes: {
        label: 'text-black/50 dark:text-white text-tiny',
        input: [
          'bg-transparent',
          'text-black/90 dark:text-white/90',
          'placeholder:text-default-700/50 dark:placeholder:text-white/60',
        ],
        innerWrapper: 'bg-transparent',
        inputWrapper: [
          'shadow-xl',
          'bg-default-200/50',
          'dark:bg-default-900/60',
          'backdrop-blur-xl',
          'backdrop-saturate-200',
          'hover:bg-default-200/70',
          'focus-within:!bg-default-200/50',
          'dark:hover:bg-default-900/70',
          'dark:focus-within:!bg-default-900/60',
          '!cursor-text',
        ],
      },
    }),
  )

  const labelContent = <label {...getLabelProps()}>{props.label}</label>

  const end = createMemo(() => {
    if (properties.isClearable) {
      return <span {...getClearButtonProps()}>{props.endContent || <CloseFilledIcon />}</span>
    }

    return props.endContent
  })

  const innerWrapper = createMemo(() => {
    if (props.startContent || end()) {
      return (
        <div {...getInnerWrapperProps()}>
          {props.startContent}
          <input {...getInputProps()} />
          {end()}
        </div>
      )
    }

    return <input {...getInputProps()} />
  })

  return (
    <div class="w-[340px] h-[300px] px-8 rounded-2xl flex justify-center items-center bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg">
      <Dynamic as={Component} {...getBaseProps()}>
        {properties.shouldLabelBeOutside ? labelContent : null}
        <div
          {...getInputWrapperProps()}
          role="button"
          onClick={() => {
            domRef()?.focus()
          }}
        >
          {properties.shouldLabelBeInside ? labelContent : null}
          {innerWrapper()}
        </div>
        {props.description && <div {...getDescriptionProps()}>{props.description}</div>}
        {properties.errorMessage && (
          <div {...getErrorMessageProps()}>{properties.errorMessage}</div>
        )}
      </Dynamic>
    </div>
  )
}

const WithModularFormsTemplate = (args: TextfieldProps) => {
  type LoginForm = {
    withDefaultValue: string
    withoutDefaultValue: string
    requiredField: string
  }

  const [loginForm, { Form, Field }] = createForm<LoginForm>()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <Form class="flex flex-col gap-4" onSubmit={onSubmit}>
      <Field name="withDefaultValue">
        {(field, props) => (
          <div>
            <Textfield
              {...args}
              {...props}
              defaultValue="ceo@saftox.com"
              isClearable
              label="With default value"
              // value={field.value || ""}
            />
          </div>
        )}
      </Field>
      <button class={button({ class: 'w-fit' }).base()} type="submit">
        Submit
      </button>
    </Form>
  )
}

export const Default = {
  render: MirrorTemplate,

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

export const Disabled = {
  render: Template,

  args: {
    ...defaultProps,
    defaultValue: 'ceo@saftox.com',
    variant: 'faded',
    isDisabled: true,
  },
}

export const ReadOnly = {
  render: Template,

  args: {
    ...defaultProps,
    defaultValue: 'ceo@saftox.com',
    variant: 'bordered',
    isReadOnly: true,
  },
}

export const WithoutLabel = {
  render: Template,

  args: {
    ...defaultProps,
    label: null,
    'aria-label': 'Email',
    placeholder: 'Enter your email',
  },
}

export const WithDescription = {
  render: MirrorTemplate,

  args: {
    ...defaultProps,
    description: "We'll never share your email with anyone else.",
  },
}

export const Password = {
  render: PasswordTemplate,

  args: {
    ...defaultProps,
    label: 'Password',
    placeholder: 'Enter your password',
    variant: 'bordered',
  },
}

export const LabelPlacement = {
  render: LabelPlacementTemplate,

  args: {
    ...defaultProps,
  },
}

export const Clearable = {
  render: Template,

  args: {
    ...defaultProps,
    variant: 'bordered',
    placeholder: 'Enter your email',
    defaultValue: 'ceo@saftox.com',
    onClear: () => console.log('input cleared'),
  },
}

export const StartContent = {
  render: StartContentTemplate,

  args: {
    ...defaultProps,
    labelPlacement: 'outside',
  },
}

export const EndContent = {
  render: EndContentTemplate,

  args: {
    ...defaultProps,
    variant: 'bordered',
    labelPlacement: 'outside',
  },
}

export const StartAndEndContent = {
  render: StartAndEndContentTemplate,

  args: {
    ...defaultProps,
    variant: 'bordered',
    labelPlacement: 'outside',
  },
}

export const WithErrorMessage = {
  render: Template,

  args: {
    ...defaultProps,
    isInvalid: true,
    errorMessage: 'Please enter a valid email address',
  },
}

export const WithErrorMessageFunction = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    min: '0',
    max: '100',
    type: 'number',
    isRequired: true,
    label: 'Number',
    placeholder: 'Enter a number(0-100)',
    errorMessage: (value: any) => {
      if (value.validationDetails.rangeOverflow) {
        return 'Value is too high'
      }
      if (value.validationDetails.rangeUnderflow) {
        return 'Value is too low'
      }
      if (value.validationDetails.valueMissing) {
        return 'Value is required'
      }
    },
  },
}

export const WithValidation = {
  render: FormTemplate,

  args: {
    ...defaultProps,
    type: 'number',
    validate: (value: number) => {
      if (value < 0 || value > 100) {
        return 'Value must be between 0 and 100'
      }
    },
    isRequired: true,
    label: 'Number',
    placeholder: 'Enter a number(0-100)',
  },
}

export const IsInvalid = {
  render: Template,

  args: {
    ...defaultProps,
    variant: 'bordered',
    isInvalid: true,
    defaultValue: 'invalid@email.com',
    placeholder: 'Enter your email',
    errorMessage: 'Please enter a valid email address',
  },
}

export const RegexValidation = {
  render: RegexValidationTemplate,

  args: {
    ...defaultProps,
    variant: 'faded',
  },
}

export const InputTypes = {
  render: InputTypesTemplate,

  args: {
    ...defaultProps,
  },
}

export const Controlled = {
  render: ControlledTemplate,

  args: {
    ...defaultProps,
    variant: 'bordered',
  },
}

export const CustomWithClassNames = {
  render: CustomWithClassNamesTemplate,

  args: {
    ...defaultProps,
  },
}

export const CustomWithHooks = {
  render: CustomWithHooksTemplate,

  args: {
    ...defaultProps,
    label: 'Search',
    type: 'search',
    placeholder: 'Type to search...',
    startContent: (
      <SearchIcon class="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
    ),
  },
}

export const WithModularFormsForm = {
  render: WithModularFormsTemplate,

  args: {
    ...defaultProps,
  },
}
