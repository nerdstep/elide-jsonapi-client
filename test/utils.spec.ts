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
})
