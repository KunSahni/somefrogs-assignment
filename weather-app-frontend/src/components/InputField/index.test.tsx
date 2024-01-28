import { mount, shallow, ShallowWrapper } from 'enzyme'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ErrorMessage } from '../Text'
import { InputField } from './index'

describe('Testing InputField', () => {
  let inputFieldWrapper: ShallowWrapper
  const mockData = {
    name: 'test-input-field',
    label: 'Test Input Field',
    value: '',
    dataTestId: 'test-input-field',
    onChange: vi.fn()
  }

  beforeEach(() => {
    inputFieldWrapper = shallow(
      <InputField
        data-test-id={mockData.dataTestId}
        label={mockData.label}
        name={mockData.name}
        type={'text'}
        value={mockData.value}
        onChange={mockData.onChange}
        required={false}
      />
    )
  })

  test('should render correctly', () => {
    const inputElement = inputFieldWrapper.find(HTMLInputElement)
    expect(inputElement).toHaveLength(1)
    expect(inputElement.render().val()).toBe(mockData.value.toString())
    expect(inputElement.props()).toHaveProperty('type')
    expect(inputElement.props()['type']).toBe('text')

    expect(inputFieldWrapper.find(HTMLLabelElement)).toHaveLength(1)
    expect(inputFieldWrapper.find(ErrorMessage)).toHaveLength(0)
    expect(inputFieldWrapper.find('button')).toHaveLength(0)
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

  test('should delete button be accessible', () => {
    inputFieldWrapper.setProps({ value: 'a' })
    const mountedInputFieldWrapper = mount(inputFieldWrapper.getElement())

    const deleteButton = mountedInputFieldWrapper.find('button')
    expect(deleteButton.props()).toHaveProperty('aria-describedby')
    const describedById: string | undefined = deleteButton.props()['aria-describedby']
    expect(mountedInputFieldWrapper.find(`#${describedById}`)).toBeTruthy()
  })

  test('should render accessible error message when passed', () => {
    // Check if error message is rendered correctly
    expect(inputFieldWrapper.find(ErrorMessage)).toHaveLength(0)
    inputFieldWrapper.setProps({ value: '12', error: 'Test Error' })
    const errorMessageElement = inputFieldWrapper.find(ErrorMessage)
    expect(errorMessageElement).toHaveLength(1)
    expect(errorMessageElement.text()).toBe('Test Error')

    // Check if error message is accessible
    const errorMessageId = errorMessageElement.props()['id']
    const inputDescribedById: string = inputFieldWrapper.find(HTMLInputElement).props()['aria-describedby']
    expect(inputDescribedById.split(' ')).toContain(errorMessageId)
  })

  test('should call onChange when value is changed', () => {
    inputFieldWrapper.find(HTMLInputElement).simulate('change', { target: { value: 'a' } })
    expect(mockData.onChange).toHaveBeenCalledTimes(1)
  })

  test('should call onChange when delete button is clicked', () => {
    inputFieldWrapper.setProps({ value: 'a', onChange: mockData.onChange })
    const mountedInputFieldWrapper = mount(inputFieldWrapper.getElement())
    expect(mockData.onChange).toHaveBeenCalledTimes(1)
    const deleteButton = mountedInputFieldWrapper.find('button')
    deleteButton.simulate('click')
    expect(mockData.onChange).toHaveBeenCalledTimes(2)
  })
})
