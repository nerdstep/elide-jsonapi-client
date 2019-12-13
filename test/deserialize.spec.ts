import { deserialize } from '../src/deserialize'

const resource = require('../jsonapi-spec/resource.json')
const collection = require('../jsonapi-spec/collection.json')
const collectionIncludes = require('../jsonapi-spec/collectionIncludes.json')

const responseResource = {
  id: '1',
  type: 'articles',
  title: 'JSON API paints my bikeshed!',
  author: { type: 'people', id: '9' },
  comments: [{ type: 'comments', id: '5' }, { type: 'comments', id: '12' }],
}

describe('deserialize', () => {
  it('deserializes a resource', () => {
    expect.assertions(1)
    expect(deserialize(resource)).toEqual({
      data: responseResource,
    })
  })

  it('deserializes a resource collection', () => {
    expect.assertions(1)
    expect(deserialize(collection)).toEqual({
      data: [responseResource],
      meta: { page: { limit: 10, totalRecords: 1 } },
    })
  })

  it('deserializes a resource collection with included data', () => {
    expect.assertions(2)
    expect(deserialize(collectionIncludes)).toEqual({
      data: [
        {
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
              author: { 
                type: 'people', 
                id: '2',
                firstname: 'Sally',
                lastname: 'Creasey',
                office: {
                  type: 'contact',
                  id: '8',
                  email: 's.creasey@example.com',
                  phone: '111-222-3333',
                },
                twitter: 'creaseS',
              },
            },
            {
              type: 'comments',
              id: '12',
              body: 'I like XML better',
              author: { 
                type: 'people', 
                id: '9',
                firstname: 'Dan',
                lastname: 'Gebhardt',
                twitter: 'dgeb',
              },
            },
          ],
        },
      ],
    })
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
    ).toEqual({
      data: [
        {
          type: 'articles',
          id: '1',
          comments: [
            { type: 'comments', id: '5' },
            { type: 'comments', id: '12' },
          ],
        },
      ],
    })
  })

  it('deserializes a resource without relationships', () => {
    expect.assertions(1)
    const obj = Object.assign({}, resource)
    delete obj.data.relationships
    const res = Object.assign({}, responseResource)
    delete res.author
    delete res.comments
    expect(deserialize(obj)).toEqual({ data: res })
  })

  it('should return empty or falsey values', () => {
    expect.assertions(3)
    // @ts-ignore
    expect(deserialize(null)).toBe(null)
    // @ts-ignore
    expect(deserialize('')).toBe('')
    // @ts-ignore
    expect(deserialize()).toBe(undefined)
  })

  it('should return the original response', () => {
    expect.assertions(1)
    // @ts-ignore
    expect(deserialize({ data: null })).toEqual({ data: null })
  })
})
