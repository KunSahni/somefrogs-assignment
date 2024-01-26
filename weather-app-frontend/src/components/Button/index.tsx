import styled from 'styled-components'

export const PrimaryButton = styled.button`
  font-size: 1.5rem;
  line-height: 2rem;
  font-style: normal;
  font-stretch: normal;
  text-transform: none;
  font-weight: 600;
  font-family: monospace, Helvetica;
  text-align: center;
  background: var(--color-backgroundCtaPrimary);
  color: var(--color-textCtaPrimary);
  border: none;
  border-radius: 0.5rem;
  padding: 0px 1rem;
  min-height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover:enabled {
    box-shadow: var(--box-shadow-small);
  }
`

export const SecondaryButton = styled.button`
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-style: normal;
  font-stretch: normal;
  text-transform: none;
  font-weight: 500;
  font-family: monospace, Helvetica;
  text-align: center;
  background: var(--color-backgroundCtaSecondary);
  color: var(--color-textCtaSecondary);
  border: none;
  border-radius: 0.5rem;
  padding: 0px 1rem;
  min-height: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover:enabled {
    box-shadow: var(--box-shadow-small);
  }
  &:active {
    background: var(--color-backgroundCtaSecondary-active);
  }
  &:disabled {
    background: var(--color-backgroundCtaSecondary-disabled);
    color: var(--color-textCtaSecondary-disabled);
    cursor: not-allowed;
  }
`

export const IconButton = styled(SecondaryButton)`
  border-radius: 100%;
  width: 2rem;
  &:hover:enabled {
    transform: scale(1.08);
  }
`
