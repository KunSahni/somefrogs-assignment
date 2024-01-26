import { mount, shallow, ShallowWrapper } from 'enzyme'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { IconButton } from '../Button'
import { ErrorMessage } from '../Text'
import { InputField } from './index'

const inputFieldMockData: {
  type: 'datetime-local' | 'number'
  name: string
  label: string
  value: any
  dataTestId: string
  onChange: () => {}
  stepper?: {
    step: number
    decrementDesc: string
    incrementDesc: string
  }
}[] = [
  {
    type: 'datetime-local',
    name: 'test-input-field-datetime-local',
    label: 'Test Input Field - Datetime Local',
    value: new Date(),
    dataTestId: 'test-input-field-datetime-local',
    onChange: vi.fn()
  },
  {
    type: 'number',
    name: 'test-input-field-number',
    label: 'Test Input Field - Number',
    value: 0,
    dataTestId: 'test-input-field-number',
    onChange: vi.fn()
  },
  {
    type: 'number',
    name: 'test-input-field-number-with-stepper',
    label: 'Test Input Field - Number With Stepper',
    value: 0,
    dataTestId: 'test-input-field-number-with-stepper',
    onChange: vi.fn(),
    stepper: { step: 1, decrementDesc: '', incrementDesc: '' }
  }
]

describe.each(inputFieldMockData)('Testing InputField - type: $type, stepper: $stepper.step', (inputFieldMock) => {
  let inputFieldWrapper: ShallowWrapper

  beforeEach(() => {
    inputFieldWrapper = shallow(
      <InputField
        data-test-id={inputFieldMock.dataTestId}
        label={inputFieldMock.label}
        name={inputFieldMock.name}
        type={inputFieldMock.type}
        value={inputFieldMock.value}
        onChange={inputFieldMock.onChange}
        required={false}
        stepper={inputFieldMock.stepper}
      />
    )
  })

  test('should render correctly', () => {
    const inputElement = inputFieldWrapper.find(HTMLInputElement)
    expect(inputElement).toHaveLength(1)
    expect(inputElement.render().val()).toBe(inputFieldMock.value.toString())
    expect(inputElement.props()).toHaveProperty('type')
    expect(inputElement.props()['type']).toBe(inputFieldMock.type)

    expect(inputFieldWrapper.find(HTMLLabelElement)).toHaveLength(1)
    expect(inputFieldWrapper.find(ErrorMessage)).toHaveLength(0)
    expect(inputFieldWrapper.find(IconButton)).toHaveLength(inputFieldMock.stepper ? 2 : 0)
  })

  test('should be accessible', () => {
    // Check if input is accessible
    const inputElement = inputFieldWrapper.find(HTMLInputElement)
    expect(inputElement.props()).toHaveProperty('aria-describedby')
    expect(inputElement.props()).toHaveProperty('aria-labelledby')
    expect(inputElement.props()).toHaveProperty('aria-invalid')

    // Check if aria-describedby and aria-labelledby are pointing to correct elements
    const describedById: string = inputElement.props()['aria-describedby']
    const labelledById: string = inputElement.props()['aria-labelledby']
    expect(inputFieldWrapper.find(`#${describedById}`)).toBeTruthy()
    expect(inputFieldWrapper.find(`#${labelledById}`)).toBeTruthy()
  })

  test.runIf(inputFieldMock.stepper !== undefined)('should steppers be accessible', () => {
    const stepperElements = inputFieldWrapper.find(IconButton)
    stepperElements.forEach((stepperElement) => {
      expect(stepperElement.props()).toHaveProperty('aria-describedby')
      const describedById: string = stepperElement.props()['aria-describedby']
      expect(inputFieldWrapper.find(`#${describedById}`)).toBeTruthy()
    })
  })

  test('should render accessible error message when passed', () => {
    // Check if error message is rendered correctly
    expect(inputFieldWrapper.find(ErrorMessage)).toHaveLength(0)
    inputFieldWrapper.setProps({ error: 'Test Error' })
    const errorMessageElement = inputFieldWrapper.find(ErrorMessage)
    expect(errorMessageElement).toHaveLength(1)
    expect(errorMessageElement.text()).toBe('Test Error')

    // Check if error message is accessible
    const errorMessageId = errorMessageElement.props()['id']
    const inputDescribedById: string = inputFieldWrapper.find(HTMLInputElement).props()['aria-describedby']
    expect(inputDescribedById.split(' ')).toContain(errorMessageId)
  })

  test('should call onChange when value is changed', () => {
    inputFieldWrapper.find(HTMLInputElement).simulate('change', { target: { value: 1 } })
    expect(inputFieldMock.onChange).toHaveBeenCalledTimes(1)
  })

  test.runIf(inputFieldMock.stepper !== undefined && inputFieldMock.type === 'number')(
    'should call onChange when stepper is clicked',
    () => {
      let propValue = inputFieldMock.stepper!.step * 2
      const expectedIncrementedValue = propValue + inputFieldMock.stepper!.step
      const expectedDecrementedValue = propValue - inputFieldMock.stepper!.step
      inputFieldWrapper.setProps({ value: propValue, onChange: (e: any) => (propValue = e.target.value) })
      let mountedInputFieldWrapper = mount(inputFieldWrapper.getElement())

      // Check if increment stepper fires onChange with correct value
      const increaseStepperElement = mountedInputFieldWrapper.find(
        'button[data-test-id="button-' + inputFieldMock.name + '-stepper-increment"]'
      )
      increaseStepperElement.simulate('click')
      expect(propValue).toBe(expectedIncrementedValue)

      // Check if decrement stepper fires onChange with correct value
      const decreaseStepperElement = mountedInputFieldWrapper.find(
        'button[data-test-id="button-' + inputFieldMock.name + '-stepper-decrement"]'
      )
      decreaseStepperElement.simulate('click')
      expect(propValue).toBe(expectedDecrementedValue)
    }
  )
})
