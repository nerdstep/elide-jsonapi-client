import { mapResources } from '../src/mapResources'

const resource = { id: '1', type: 'foo', foo: true }
const mapped = { id: '1', type: 'foo' }

describe('mapResources', () => {
  it('maps a resource object', () => {
    expect(mapResources(resource)).toEqual([mapped])
  })

  it('maps an array of resources', () => {
    expect(mapResources([resource])).toEqual([mapped])
  })

  it('returns an empty array', () => {
    expect(mapResources(null)).toEqual([])
  })
})
