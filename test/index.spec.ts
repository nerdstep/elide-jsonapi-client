import ApiClient from '../src/index'

const api = new ApiClient({ baseURL: 'http://localhost', timeout: 5000 })

describe('ApiClient', () => {
  it('is instantiable', () => {
    expect(new ApiClient()).toBeInstanceOf(ApiClient)
  })

  it('has default values', () => {
    expect(api.axios.defaults.baseURL).toBe('http://localhost')
    expect(api.axios.defaults.timeout).toBe(5000)
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
