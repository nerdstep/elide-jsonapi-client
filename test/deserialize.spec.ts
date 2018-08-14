import { deserialize } from '../src/deserialize'

const collection = require('../jsonapi-spec/collection.json')

describe('deserialize', () => {
  it('deserializes a resource collection', () => {
    expect.assertions(1)
    expect(deserialize(collection.data)).toEqual([
      {
        id: '1',
        type: 'articles',
        title: 'JSON API paints my bikeshed!',
        links: {
          self: 'http://example.com/articles/1',
        },
      },
    ])
  })
})
