import { serializeParams } from '../src/serializeParams'

describe('serializeParams', () => {
  it('serializes no provided params', () => {
    expect(serializeParams()).toBe('')
  })

  it('serializes with ? prefix', () => {
    expect(serializeParams({}, { totals: true, prefix: true })).toBe(
      encodeURI('?page[totals]=true'),
    )
  })

  it('serializes fields param', () => {
    expect.assertions(1)
    expect(
      serializeParams({
        fields: {
          a: ['foo', 'bar'],
          b: 'foobar',
          c: {
            d: 'baz',
          },
        },
      }),
    ).toBe(encodeURI('fields[a]=foo,bar&fields[b]=foobar&fields[c][d]=baz'))
  })

  it('serializes filter param', () => {
    expect.assertions(1)
    expect(
      serializeParams({
        filter: 'foo=ne=bar',
      }),
    ).toBe(encodeURI('filter=foo=ne=bar'))
  })

  it('serializes include param', () => {
    expect.assertions(3)
    expect(
      serializeParams({
        include: ['foo', 'bar'],
      }),
    ).toBe(encodeURI('include=foo,bar'))
    expect(
      serializeParams({
        include: 'foo,bar',
      }),
    ).toBe(encodeURI('include=foo,bar'))
    expect(
      serializeParams({
        include: null,
      }),
    ).toBe('')
  })

  it('serializes include param', () => {
    expect.assertions(2)
    expect(
      serializeParams({
        sort: ['-foo', '+bar.biz'],
      }),
    ).toBe(encodeURI('sort=-foo,+bar.biz'))
    expect(
      serializeParams({
        sort: '-foo,+bar.biz',
      }),
    ).toBe(encodeURI('sort=-foo,+bar.biz'))
  })

  it('serializes page & pageSize params', () => {
    expect.assertions(4)
    expect(serializeParams({ page: -1 }, { size: 15, type: 'offset' })).toBe(
      encodeURI('page[offset]=0&page[limit]=15'),
    )
    expect(serializeParams({}, { totals: true, type: 'offset' })).toBe(
      encodeURI('page[totals]=true&page[offset]=0&page[limit]=10'),
    )
    expect(
      serializeParams(
        {
          page: 2,
          pageSize: 20,
        },
        { type: 'offset' },
      ),
    ).toBe(encodeURI('page[offset]=20&page[limit]=20'))
    expect(
      serializeParams(
        {
          page: 1,
          pageSize: 15,
        },
        { type: 'page' },
      ),
    ).toBe(encodeURI('page[number]=1&page[size]=15'))
  })
})
