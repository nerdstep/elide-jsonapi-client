import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)
const api = new ApiClient()

afterEach(() => {
  mock.reset()
})

describe('patch', () => {
  describe('mutate', () => {
    it('should bulk add', async done => {
      expect.assertions(2)

      const req = [
        { type: 'articles', title: 'Hello World' },
        { type: 'articles', title: 'Lorem Ipsum' },
      ]

      const reqSerialized = [
        {
          op: 'add',
          path: '/-',
          value: {
            id: '__id__',
            type: 'articles',
            attributes: { title: 'Hello World' },
          },
        },
        {
          op: 'add',
          path: '/-',
          value: {
            id: '__id__',
            type: 'articles',
            attributes: { title: 'Lorem Ipsum' },
          },
        },
      ]

      const res = [
        {
          data: {
            id: '1',
            type: 'articles',
            attributes: { title: 'Hello World' },
          },
        },
        {
          data: {
            id: '2',
            type: 'articles',
            attributes: { title: 'Lorem Ipsum' },
          },
        },
      ]

      const resDeserialied = [
        { id: '1', type: 'articles', title: 'Hello World' },
        { id: '2', type: 'articles', title: 'Lorem Ipsum' },
      ]

      mock.onPatch('/articles').reply(config => {
        const data = JSON.parse(config.data)
        expect(data).toEqual(reqSerialized)
        return [200, res]
      })

      try {
        const data = await api.mutate('articles', 'add', '/-', req)
        expect(data).toEqual(resDeserialied)
        done()
      } catch (err) {
        done.fail(err)
      }
    })

    it('should bulk remove', async done => {
      expect.assertions(2)

      const req = [{ id: '1', type: 'articles' }, { id: '2', type: 'articles' }]

      const reqSerialized = [
        {
          op: 'remove',
          path: '',
          value: {
            id: '1',
            type: 'articles',
          },
        },
        {
          op: 'remove',
          path: '',
          value: {
            id: '2',
            type: 'articles',
          },
        },
      ]

      const res = [
        {
          data: null,
        },
      ]

      mock.onPatch('/articles').reply(config => {
        const data = JSON.parse(config.data)
        expect(data).toEqual(reqSerialized)
        return [200, res]
      })

      try {
        const data = await api.mutate('articles', 'remove', '', req)
        expect(data).toEqual(res)
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
