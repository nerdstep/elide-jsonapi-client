import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'
import { error } from '../src/error'

const mock = new MockAdapter(axios)
const api = new ApiClient()
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

afterEach(() => {
  mock.reset()
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

  it('should handle Elide server errors', async done => {
    expect.assertions(3)

    const err = {
      error: 'Internal Server Error',
      message: 'Something really bad happened',
      path: '/articles',
      status: 500,
      timestamp: new Date().toISOString(),
    }

    mock.onGet('/articles').reply(500, err)

    try {
      await api.get('articles')
    } catch (e) {
      expect(e.status).toBe(err.status)
      expect(e.statusText).toBe(err.error)
      expect(e.errors).toEqual([err.message])
      done()
    }
  })
})
