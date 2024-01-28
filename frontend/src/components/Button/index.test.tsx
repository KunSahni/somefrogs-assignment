import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'
import { IconButton, PrimaryButton, SecondaryButton } from './index'

const buttons = [
  {
    type: PrimaryButton,
    name: 'PrimaryButton',
    text: 'Primary Button',
    dataTestId: 'test-primary-button'
  },
  {
    type: SecondaryButton,
    name: 'SecondaryButton',
    text: 'Secondary Button',
    dataTestId: 'test-secondary-button'
  },
  {
    type: IconButton,
    name: 'IconButton',
    text: '',
    dataTestId: 'test-icon-button'
  }
]

describe.each(buttons)('Testing $name', (button) => {
  let onClickMock: Mock

  beforeEach(() => {
    onClickMock = vi.fn()
    render(
      <button.type data-test-id={button.dataTestId} onClick={onClickMock}>
        {button.text}
      </button.type>
    )
    render(
      <button.type data-test-id={button.dataTestId + '-disabled'} onClick={onClickMock} disabled={true}>
        {button.text}
      </button.type>
    )
  })

  test('should render correctly', () => {
    const buttonRef = screen.queryByTestId(button.dataTestId)
    expect(buttonRef).toBeInTheDocument()
    expect(buttonRef?.textContent).toBe(button.text)

    const disabledButtonRef = screen.queryByTestId(button.dataTestId + '-disabled')
    expect(disabledButtonRef).toBeInTheDocument()
    expect(disabledButtonRef?.textContent).toBe(button.text)
  })

  test('should handle onClick when not disabled', () => {
    expect(onClickMock).toHaveBeenCalledTimes(0)
    const buttonRef = screen.queryByTestId(button.dataTestId)
    if (buttonRef) fireEvent.click(buttonRef)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('should not fire onClick when disabled', () => {
    expect(onClickMock).toHaveBeenCalledTimes(0)
    const disabledButtonRef = screen.queryByTestId(button.dataTestId + '-disabled')
    if (disabledButtonRef) fireEvent.click(disabledButtonRef)
    expect(onClickMock).toHaveBeenCalledTimes(0)
  })
})
