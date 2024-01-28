import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { ErrorMessage, PrimaryParagraph, PrimaryTitle, SecondaryParagraph, SecondaryTitle } from './index'

const texts = [
  {
    type: PrimaryTitle,
    name: 'PrimaryTitle',
    text: 'Primary Title',
    dataTestId: 'test-primary-title',
    expectedTagName: 'h1'
  },
  {
    type: SecondaryTitle,
    name: 'SecondaryTitle',
    text: 'Secondary Title',
    dataTestId: 'test-secondary-title',
    expectedTagName: 'h2'
  },
  {
    type: PrimaryParagraph,
    name: 'PrimaryParagraph',
    text: 'Primary Paragraph',
    dataTestId: 'test-primary-paragraph',
    expectedTagName: 'p'
  },
  {
    type: SecondaryParagraph,
    name: 'SecondaryParagraph',
    text: 'Secondary Paragraph',
    dataTestId: 'test-secondary-paragraph',
    expectedTagName: 'p'
  },
  {
    type: ErrorMessage,
    name: 'ErrorMessage',
    text: 'Error Message',
    dataTestId: 'test-error-message',
    expectedTagName: 'span'
  }
]

describe.each(texts)('Testing $name', (text) => {
  beforeEach(() => {
    render(<text.type data-test-id={text.dataTestId}>{text.text}</text.type>)
  })
  test('should render correctly and not be editable', () => {
    const textRef = screen.queryByTestId(text.dataTestId)
    expect(textRef).toBeInTheDocument()
    expect(textRef?.tagName.toLowerCase()).toBe(text.expectedTagName)
    expect(textRef?.isContentEditable).toBeFalsy()
    expect(textRef?.textContent).toBe(text.text)
  })
})
