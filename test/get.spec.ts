import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const collection = require('../jsonapi-spec/collection.json')

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

  it('should deserialize data', async done => {
    expect.assertions(1)
    mock.onGet('/articles').reply(200, collection)

    try {
      const res = await api.get('articles')
      expect(res).toEqual({
        data: [
          {
            id: '1',
            type: 'articles',
            title: 'JSON API paints my bikeshed!',
            author: { type: 'people', id: '9' },
            comments: [
              { type: 'comments', id: '5' },
              { type: 'comments', id: '12' },
            ],
          },
        ],
        meta: { page: { limit: 10, totalRecords: 1 } },
      })
      done()
    } catch (err) {
      done.fail(err)
    }
  })
})
