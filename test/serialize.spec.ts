import {
  ID_REQUIRED,
  TYPE_REQUIRED,
  MISSING_ID_OR_TYPE,
  serialize,
} from '../src/serialize'

const dateObj = new Date()
const dateStr = dateObj.toISOString()
const timestamp = dateObj.valueOf()

describe('serialize', () => {
  it('should cast id to a string', () => {
    expect.assertions(1)
    expect(
      serialize({
        id: 1,
        type: 'articles',
      }),
    ).toEqual({
      data: {
        id: '1',
        type: 'articles',
      },
    })
  })

  it('should throw if not an object', () => {
    expect.assertions(1)
    expect(() =>
      // @ts-ignore
      serialize([]),
    ).toThrow(`Expected an object but received \`${typeof []}\``)
  })

  it('should throw if ID is missing', () => {
    expect.assertions(1)
    expect(() =>
      serialize(
        {
          type: 'articles',
        },
        { idRequired: true },
      ),
    ).toThrow(ID_REQUIRED)
  })

  it('should throw if Type is missing', () => {
    expect.assertions(1)
    expect(() =>
      serialize({
        id: '1',
      }),
    ).toThrow(TYPE_REQUIRED)
  })

  it('should throw if ID or Type is missing', () => {
    expect.assertions(2)
    expect(() =>
      serialize({
        id: '1',
        type: 'articles',
        author: { id: '9' },
      }),
    ).toThrow(MISSING_ID_OR_TYPE)
    expect(() =>
      serialize({
        id: '1',
        type: 'articles',
        comments: [{ type: 'comments' }],
      }),
    ).toThrow(MISSING_ID_OR_TYPE)
  })

  it('should convert date to epoch time', () => {
    expect.assertions(1)
    expect(
      serialize(
        {
          type: 'articles',
          date: dateStr,
        },
        { dateAttrs: ['date'] },
      ),
    ).toEqual({
      data: {
        type: 'articles',
        attributes: {
          date: timestamp,
        },
      },
    })
  })

  it('should not convert a bad date', () => {
    expect.assertions(1)
    expect(
      serialize(
        {
          type: 'articles',
          date: '2018-13-32',
        },
        { dateAttrs: ['date'] },
      ),
    ).toEqual({
      data: {
        type: 'articles',
        attributes: {
          date: '2018-13-32',
        },
      },
    })
  })

  it('should omit protected attributes', () => {
    expect.assertions(1)
    expect(
      serialize(
        {
          type: 'articles',
          foo: 'bar',
          bar: 'foo',
        },
        { protectedAttrs: ['foo'] },
      ),
    ).toEqual({
      data: {
        type: 'articles',
        attributes: {
          bar: 'foo',
        },
      },
    })
  })

  it('serializes a resource', () => {
    expect.assertions(1)
    expect(
      serialize(
        {
          id: 1,
          type: 'articles',
          title: 'JSON API paints my bikeshed!',
          isFoobar: true,
          views: 100,
        },
        { idRequired: true },
      ),
    ).toEqual({
      data: {
        id: '1',
        type: 'articles',
        attributes: {
          title: 'JSON API paints my bikeshed!',
          isFoobar: true,
          views: 100,
        },
      },
    })
  })

  it('serializes a resource with relationships', () => {
    expect.assertions(1)
    expect(
      serialize({
        type: 'articles',
        title: 'JSON API paints my bikeshed!',
        author: { type: 'people', id: '9' },
        comments: [
          { type: 'comments', id: '5' },
          { type: 'comments', id: '12' },
        ],
      }),
    ).toEqual({
      data: {
        type: 'articles',
        attributes: {
          title: 'JSON API paints my bikeshed!',
        },
        relationships: {
          people: {
            data: { type: 'people', id: '9' },
          },
          comments: {
            data: [
              { type: 'comments', id: '5' },
              { type: 'comments', id: '12' },
            ],
          },
        },
      },
    })
  })
})
