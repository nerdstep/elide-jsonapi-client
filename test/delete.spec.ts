import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)
const api = new ApiClient()

afterEach(() => {
  mock.reset()
})

describe('delete', () => {
  it('should set header', async done => {
    expect.assertions(1)

    mock.onDelete('/articles/1').reply(config => {
      expect(config.headers.foo).toBe(true)
      return [204]
    })

    try {
      await api.remove('articles', '1', { foo: true })
      done()
    } catch (err) {
      done.fail(err)
    }
  })

  it('should have the correct URL', async done => {
    expect.assertions(1)

    mock.onDelete('/articles/1').reply(config => {
      expect(config.url).toBe('/articles/1')
      return [204]
    })

    try {
      await api.remove('articles', '1')
      done()
    } catch (err) {
      done.fail(err)
    }
  })

  it('should fail with network error', async done => {
    expect.assertions(1)
    mock.onDelete('/articles/1').networkError()

    try {
      await api.remove('articles', '1')
    } catch (err) {
      expect(err.message).toBe('Network Error')
      done()
    }
  })
})
