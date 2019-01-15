import * as util from '../src/util'

describe('util', () => {
  it('ensure value is an array', () => {
    expect(util.isArray([])).toEqual(true)
  })

  it('ensure value is an object', () => {
    expect(util.isObject({})).toEqual(true)
  })

  it('ensure value is a plain object', () => {
    expect(util.isPlainObject({})).toEqual(true)
  })

  it('converts a Date object into milis', () => {
    expect.assertions(2)
    const date = new Date()
    expect(util.parseDate(date.toISOString())).toEqual(date.valueOf())
    expect(util.parseDate('not a date')).toEqual('not a date')
  })

  it('concatenates arrays into an array of unique values', () => {
    expect.assertions(2)
    expect(util.concatUnique([1, 2], [2, 3], [1, 3, 4])).toEqual([1, 2, 3, 4])
    expect(util.concatUnique(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })
})
