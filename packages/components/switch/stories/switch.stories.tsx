import type { Meta } from '@saftox-ui/storybook-solid'
import type { SwitchProps, SwitchThumbIconProps } from '../src'

import { createForm, required, setValue } from '@modular-forms/solid'
import { MoonFilledIcon, SunFilledIcon } from '@saftox-ui/shared-icons'
import { clsx } from '@saftox-ui/shared-utils'
import { Dynamic } from '@saftox-ui/solid-utils/dynamic'
import { button, toggle } from '@saftox-ui/theme'
import { createVisuallyHidden } from '@saftox-ui/visually-hidden'
import { Show, createSignal } from 'solid-js'
import { Switch, useSwitch } from '../src'

import { Button } from '@saftox-ui/button'

export default {
  title: 'Components/Switch',
  component: Switch,
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
    disableAnimation: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Switch>

const defaultProps = {
  ...toggle.defaultVariants,
}

const WithIconsTemplate = (args: SwitchProps) => {
  const [isSelected, setIsSelected] = createSignal<boolean>(true)

  return (
    <div class="flex flex-col gap-2">
      <Switch
        {...args}
        classes={{
          startContent: 'text-white',
        }}
        endContent={(props) => <MoonFilledIcon {...props} />}
        isSelected={isSelected()}
        startContent={(props) => <SunFilledIcon {...props} />}
        onValueChange={setIsSelected}
      />
      <p class="text-default-500">Selected: {isSelected() ? 'true' : 'false'}</p>
    </div>
  )
}

const ControlledTemplate = (args: SwitchProps) => {
  const [isSelected, setIsSelected] = createSignal<boolean>(true)

  return (
    <div class="flex flex-col gap-2">
      <Switch {...args} isSelected={isSelected()} onValueChange={setIsSelected} />
      <p class="text-default-500">Selected: {isSelected() ? 'true' : 'false'}</p>
    </div>
  )
}

const CustomWithClassNamesTemplate = (args: SwitchProps) => {
  const [isSelected, setIsSelected] = createSignal<boolean>(true)

  return (
    <div class="flex flex-col gap-2">
      <Switch
        classes={{
          base: clsx(
            'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
            {
              'border-primary': isSelected(),
            },
          ),
        }}
        isSelected={isSelected()}
        size="lg"
        onValueChange={setIsSelected}
        {...args}
      >
        <div class="flex flex-col gap-1">
          <p class="text-base">Enable early access</p>
          <p class="text-xs text-default-400">
            Get access to new features before they are released.
          </p>
        </div>
      </Switch>
      <p class="text-default-500">Selected: {isSelected() ? 'true' : 'false'}</p>
    </div>
  )
}

const CustomWithHooksTemplate = (args: SwitchProps) => {
  const { Component, slots, properties, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch(args)

  const { visuallyHiddenProps } = createVisuallyHidden()

  return (
    <div class="flex flex-col gap-2">
      <Dynamic<SwitchProps> as={Component} {...getBaseProps()}>
        <span {...visuallyHiddenProps}>
          <input {...getInputProps()} />
        </span>
        <div
          {...getWrapperProps()}
          class={slots().wrapper({
            class: [
              'w-8 h-8',
              'flex items-center justify-center',
              'rounded-lg bg-default-100 hover:bg-default-200',
            ],
          })}
        >
          {properties.isSelected ? <SunFilledIcon /> : <MoonFilledIcon />}
        </div>
      </Dynamic>
      <p class="text-default-500 select-none">Lights: {properties.isSelected ? 'on' : 'off'}</p>
    </div>
  )
}

const WithModularFormTemplate = (args: SwitchProps) => {
  type FormData = {
    defaultTrue: boolean
    defaultFalse: boolean
    requiredField: boolean
  }

  const [form, { Form, Field, FieldArray }] = createForm<FormData>({
    validateOn: 'change',
    revalidateOn: 'input',
    initialValues: {
      defaultTrue: true,
      defaultFalse: false,
      requiredField: false,
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    alert(`data: ${JSON.stringify(data)}`)
  }

  return (
    <Form class="flex flex-col gap-4" onSubmit={onSubmit}>
      <Field name="defaultTrue" type="boolean">
        {(field, props) => {
          return (
            <Switch
              {...props}
              {...args}
              isSelected={field.value}
              onValueChange={(value) => setValue(form, 'defaultTrue', value)}
            >
              By default this switch is true
            </Switch>
          )
        }}
      </Field>
      <Field name="defaultFalse" type="boolean">
        {(field, props) => {
          return (
            <Switch
              {...props}
              {...args}
              isSelected={field.value}
              onValueChange={(value) => setValue(form, 'defaultFalse', value)}
            >
              By default this switch is false
            </Switch>
          )
        }}
      </Field>
      <Field name="requiredField" type="boolean" validate={required('This switch is required')}>
        {(field, props) => {
          return (
            <>
              <Switch
                {...props}
                {...args}
                isSelected={field.value}
                onValueChange={(value) => setValue(form, 'requiredField', value)}
              >
                This switch is required
              </Switch>
              <Show when={field.error}>
                <span class="text-danger">{field.error}</span>
              </Show>
            </>
          )
        }}
      </Field>

      <Button type="submit" variant="solid" fullWidth>
        Submit
      </Button>
    </Form>
  )
}

export const Default = {
  args: {
    ...defaultProps,
  },
}

export const IsReadOnly = {
  args: {
    ...defaultProps,
    isReadOnly: true,
    defaultSelected: true,
  },
}

export const WithLabel = {
  args: {
    ...defaultProps,
    children: 'Bluetooth',
  },
}

export const DisableAnimation = {
  args: {
    ...defaultProps,
    disableAnimation: true,
  },
}

export const WithThumbIcon = {
  args: {
    ...defaultProps,
    thumbIcon: (props: SwitchThumbIconProps) =>
      props.isSelected ? (
        <SunFilledIcon class={props.class} />
      ) : (
        <MoonFilledIcon class={props.class} />
      ),
  },
}

export const WithIcons = {
  render: WithIconsTemplate,

  args: {
    ...defaultProps,
  },
}

export const WithModularForm = {
  render: WithModularFormTemplate,

  args: {
    ...defaultProps,
  },
}

export const Controlled = {
  render: ControlledTemplate,

  args: {
    ...defaultProps,
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
  },
}
