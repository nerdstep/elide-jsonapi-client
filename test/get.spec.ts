import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)

afterEach(() => {
  mock.reset()
})

describe('get', () => {
  it('should return custom headers', async done => {
    expect.assertions(1)
    const api = new ApiClient({ headers: { foo: true } })

    mock.onGet('things').reply(config => {
      expect(config.headers).toEqual({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        foo: true,
        bar: true,
      })
      return [200, { data: [] }]
    })

    try {
      await api.get('things', undefined, { bar: true })
      done()
    } catch (err) {
      done.fail(err)
    }
  })
})
