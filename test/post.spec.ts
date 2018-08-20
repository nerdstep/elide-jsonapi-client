import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)
const api = new ApiClient()

afterEach(() => {
  mock.reset()
})

describe('post', () => {
  it('should serialize request & deserialize response', async done => {
    expect.assertions(2)

    const req = { type: 'articles', title: 'Hello World' }
    const reqSerialized = {
      type: 'articles',
      attributes: { title: 'Hello World' },
    }
    const res = {
      id: '1',
      type: 'articles',
      attributes: { title: 'Hello World' },
    }
    const resDeserialied = { id: '1', type: 'articles', title: 'Hello World' }

    mock.onPost('/articles').reply(config => {
      const { data } = JSON.parse(config.data)
      expect(data).toEqual(reqSerialized)
      return [201, { data: res }]
    })

    try {
      const data = await api.create('articles', req)
      expect(data).toEqual(resDeserialied)
      done()
    } catch (err) {
      done.fail(err)
    }
  })
})
