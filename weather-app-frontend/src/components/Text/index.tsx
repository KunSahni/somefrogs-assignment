import styled from 'styled-components'

export const PrimaryTitle = styled.h1`
  font-size: 1.75rem;
  line-height: 2.25rem;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  font-family: monospace, Helvetica;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--color-textTitle);
  padding: 1rem 0;
  margin: 0;
  @media screen and (max-width: 64rem) {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  @media screen and (max-width: 32rem) {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`

export const SecondaryTitle = styled.h2`
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  font-family: monospace, Helvetica;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--color-textTitle);
  padding: 1rem 0;
  margin: 0;
  @media screen and (max-width: 64rem) {
    font-size: 1.1rem;
    line-height: 1.5rem;
  }
  @media screen and (max-width: 32rem) {
    font-size: 1rem;
    line-height: 1.4rem;
  }
`

export const PrimaryParagraph = styled.p`
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-style: normal;
  font-stretch: normal;
  font-family: monospace, Helvetica;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--color-textPrimary);
  margin: 0.5rem 0;
  @media screen and (max-width: 64rem) {
    font-size: 1.1rem;
    line-height: 1.5rem;
  }
  @media screen and (max-width: 32rem) {
    font-size: 1rem;
    line-height: 1.4rem;
  }
`

export const SecondaryParagraph = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  font-style: normal;
  font-stretch: normal;
  font-family: monospace, Helvetica;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--color-textPrimary);
  margin: 0.25rem 0;
  @media screen and (max-width: 64rem) {
    font-size: 0.9rem;
    line-height: 1.4rem;
  }
  @media screen and (max-width: 32rem) {
    font-size: 0.8rem;
    line-height: 1.3rem;
  }
`

export const ErrorMessage = styled.span`
  font-size: 0.85rem;
  line-height: 1.35rem;
  font-style: normal;
  font-stretch: normal;
  font-weight: 500;
  font-family: monospace, Helvetica;
  text-align: left;
  text-overflow: ellipsis;
  color: var(--color-alert);
  margin: 0.25rem 0;
`
