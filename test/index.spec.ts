import ApiClient from '../src/index'

const api = new ApiClient()

describe('ApiClient test', () => {
  it('ApiClient is instantiable', () => {
    expect(new ApiClient()).toBeInstanceOf(ApiClient)
  })

  describe('getHeaders', () => {
    it('should return JSON Patch headers', () => {
      expect(api.getHeaders({ jsonPatch: true }, true)).toEqual({
        Accept: 'application/vnd.api+json; ext=jsonpatch',
        'Content-Type': 'application/vnd.api+json; ext=jsonpatch',
        jsonPatch: true,
      })
    })
  })
})
