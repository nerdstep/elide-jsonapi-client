import ApiClient from '../src/index'

describe('ApiClient test', () => {
  it('ApiClient is instantiable', () => {
    expect(new ApiClient()).toBeInstanceOf(ApiClient)
  })
})
