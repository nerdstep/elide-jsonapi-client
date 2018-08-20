import { BAD_RESPONSE, deserialize } from '../src/deserialize'

const resource = require('../jsonapi-spec/resource.json')
const collection = require('../jsonapi-spec/collection.json')
const collectionIncludes = require('../jsonapi-spec/collectionIncludes.json')

const response = {
  id: '1',
  type: 'articles',
  title: 'JSON API paints my bikeshed!',
  author: { type: 'people', id: '9' },
  comments: [{ type: 'comments', id: '5' }, { type: 'comments', id: '12' }],
}

const responseIncludes = {
  id: '1',
  type: 'articles',
  title: 'JSON API paints my bikeshed!',
  author: {
    type: 'people',
    id: '9',
    firstname: 'Dan',
    lastname: 'Gebhardt',
    twitter: 'dgeb',
  },
  comments: [
    {
      type: 'comments',
      id: '5',
      body: 'First!',
      author: { type: 'people', id: '2' },
    },
    {
      type: 'comments',
      id: '12',
      body: 'I like XML better',
      author: { type: 'people', id: '9' },
    },
  ],
}

describe('deserialize', () => {
  it('deserializes a resource', () => {
    expect.assertions(1)
    expect(deserialize(resource)).toEqual(response)
  })

  it('deserializes a resource collection', () => {
    expect.assertions(1)
    expect(deserialize(collection)).toEqual([response])
  })

  it('deserializes a resource collection with included data', () => {
    expect.assertions(1)
    expect(deserialize(collectionIncludes)).toEqual([responseIncludes])
  })

  it('deserializes a resource collection with included data', () => {
    expect.assertions(1)
    expect(
      deserialize({
        data: [
          {
            type: 'articles',
            id: '1',
            relationships: {
              comments: {
                data: [
                  { type: 'comments', id: '5' },
                  { type: 'comments', id: '12' },
                ],
              },
            },
          },
        ],
        included: [{ type: 'comments', id: '12' }],
      }),
    ).toEqual([
      {
        type: 'articles',
        id: '1',
        comments: [
          { type: 'comments', id: '5' },
          { type: 'comments', id: '12' },
        ],
      },
    ])
  })

  it('deserializes a resource without relationships', () => {
    expect.assertions(1)
    const obj = Object.assign({}, resource)
    delete obj.data.relationships
    const res = Object.assign({}, response)
    delete res.author
    delete res.comments
    expect(deserialize(obj)).toEqual(res)
  })

  it('should throw if response is invalid', () => {
    expect.assertions(1)
    expect(() => deserialize(undefined)).toThrow(BAD_RESPONSE)
  })

  it('should return the original response', () => {
    expect.assertions(1)
    expect(deserialize({ data: null })).toEqual({ data: null })
  })
})
