import { deserialize } from '../src/deserialize'

const collection = require('../jsonapi-spec/collection.json')

describe('deserialize', () => {
  it('deserializes a resource collection', () => {
    expect.assertions(1)
    expect(deserialize(collection)).toEqual([
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
    ])
  })
})
