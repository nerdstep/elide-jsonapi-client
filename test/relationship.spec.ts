import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ApiClient from '../src/index'

const mock = new MockAdapter(axios)
const api = new ApiClient()

afterEach(() => {
  mock.reset()
})

describe('createRelationship', () => {
  it('should have the correct url and serialized body', async done => {
    expect.assertions(1)

    mock.onPost('/articles/1/relationships/comments').reply(config => {
      const data = JSON.parse(config.data)
      expect(data).toEqual([
        {
          id: '1',
          type: 'comments',
        },
      ])
      return [201]
    })

    try {
      await api.createRelationship('articles', '1', 'comments', [
        {
          id: '1',
          type: 'comments',
          title: 'Hello world',
        },
      ])
      done()
    } catch (err) {
      done.fail(err)
    }
  })
})
