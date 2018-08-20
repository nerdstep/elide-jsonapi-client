import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)
const api = new ApiClient({ headers: { foo: true } })

afterEach(() => {
  mock.reset()
})

describe('get', () => {
  it('should return custom headers', async done => {
    expect.assertions(1)

    mock.onGet('/articles').reply(config => {
      expect(config.headers).toEqual({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        foo: true,
        bar: true,
      })
      return [200, { data: [] }]
    })

    try {
      await api.get('articles', undefined, { bar: true })
      done()
    } catch (err) {
      done.fail(err)
    }
  })

  it('should set params', async done => {
    expect.assertions(1)

    mock.onGet('/articles').reply(config => {
      expect(config.params).toEqual({ sort: 'author' })
      return [200, { data: [] }]
    })

    try {
      await api.get('articles', { sort: 'author' })
      done()
    } catch (err) {
      done.fail(err)
    }
  })

  it('should have error status 404', async done => {
    expect.assertions(1)
    mock.onGet('/articles/1').reply(404)

    try {
      await api.get('articles/1')
    } catch (err) {
      expect(err.status).toBe(404)
      done()
    }
  })
})
