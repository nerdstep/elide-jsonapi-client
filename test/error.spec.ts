import { error } from '../src/error'

const ERROR_MSG = 'ERROR'

const getError = ({
  message = '',
  status = 500,
  statusText = 'Server Error',
} = {}) => ({
  config: {},
  name: '',
  message,
  response: {
    data: {},
    status,
    statusText,
    headers: {},
    config: {},
  },
})

describe('error', () => {
  it('handles axios response error', () => {
    expect.assertions(1)
    const obj = getError({ message: ERROR_MSG })
    expect(() => {
      error(obj)
    }).toThrow(ERROR_MSG)
  })

  it('handles axios response error', () => {
    expect.assertions(3)
    const obj = getError({ message: ERROR_MSG })
    // @ts-ignore
    obj.response.data.errors = ['Test']
    try {
      error(obj)
    } catch (e) {
      // @ts-ignore
      expect(e.errors).toEqual(obj.response.data.errors)
      expect(e.status).toBe(500)
      expect(e.statusText).toBe('Server Error')
    }
  })

  it('handles error without response data', () => {
    expect.assertions(1)
    expect(() => {
      // @ts-ignore
      error(new Error(ERROR_MSG))
    }).toThrow(ERROR_MSG)
  })
})
