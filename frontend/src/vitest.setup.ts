import * as matchers from '@testing-library/jest-dom/matchers'
import { configure } from '@testing-library/react'
import { configure as enzymeConfigure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { afterAll, beforeAll, expect } from 'vitest'

enzymeConfigure({ adapter: new Adapter() })

expect.extend(matchers)

beforeAll(() => {
  configure({ testIdAttribute: 'data-test-id' })
})

afterAll(async () => {
  // ...
})
