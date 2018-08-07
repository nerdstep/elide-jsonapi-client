import { error } from '../src/error'

const getError = ({
  message = '',
  status = 500,
  statusText = 'Server error',
} = {}) => ({
  config: {},
  name: '',
  message,
  response: { data: {}, status, statusText, headers: {}, config: {} },
})

describe('ApiClient', () => {
  describe('error', () => {
    it('handles axios response errors', () => {
      expect.assertions(1)
      const obj = getError()
      expect(() => {
        error(obj)
      }).toThrow()
    })
  })
})
