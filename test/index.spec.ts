import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)

const api = new ApiClient({
  baseURL: 'http://localhost',
  timeout: 5000,
  protectedAttrs: ['foobar'],
  dateAttrs: ['date'],
})

describe('ApiClient', () => {
  it('is instantiable', () => {
    expect(new ApiClient()).toBeInstanceOf(ApiClient)
  })

  it('has default values', () => {
    expect(api.axios.defaults.baseURL).toBe('http://localhost')
    expect(api.axios.defaults.timeout).toBe(5000)
  })

  describe('getHeaders', () => {
    it('should return JSON Patch headers', () => {
      expect(api.getHeaders({ jsonPatch: true }, true)).toEqual({
        Accept: 'application/vnd.api+json; ext=jsonpatch',
        'Content-Type': 'application/vnd.api+json; ext=jsonpatch',
        jsonPatch: true,
      })
    })
  })

  describe('getOptions', () => {
    it('should return merged options', () => {
      expect(
        api.getOptions({
          dateAttrs: ['newDate'],
          idRequired: true,
          protectedAttrs: ['hello'],
        }),
      ).toEqual({
        dateAttrs: ['date', 'newDate'],
        idRequired: true,
        protectedAttrs: ['foobar', 'hello'],
      })
    })
  })

  describe('serialize', () => {
    it('should omit protected attributes', () => {
      expect(api.serialize({ id: '1', type: 'foo', foobar: true })).toEqual({
        data: {
          id: '1',
          type: 'foo',
        },
      })
    })

    it('should convert date value', () => {
      const dateObj = new Date()
      const dateStr = dateObj.toISOString()
      const timestamp = dateObj.valueOf()

      expect(api.serialize({ id: '1', type: 'foo', date: dateStr })).toEqual({
        data: {
          id: '1',
          type: 'foo',
          attributes: {
            date: timestamp,
          },
        },
      })
    })
  })

  describe('update', () => {
    it('should serialize the newDate property', async done => {
      expect.assertions(1)

      const newDate = new Date()

      mock.onPatch('/articles').reply(config => {
        const data = JSON.parse(config.data).data
        expect(data.attributes.newDate).toEqual(newDate.valueOf())
        return [200, { data }]
      })

      try {
        await api.update(
          'articles',
          {
            id: '1',
            type: 'articles',
            newDate: newDate.toISOString(),
          },
          { dateAttrs: ['newDate'] },
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})
