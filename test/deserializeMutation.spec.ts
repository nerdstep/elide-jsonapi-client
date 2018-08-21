import { deserializeMutation } from '../src/deserializeMutation'

describe('deserializeMutation', () => {
  it('should throw if id is missing', () => {
    expect.assertions(1)
    expect(
      deserializeMutation([
        { data: { id: '1', type: 'foo' } },
        { errors: [{ detail: 'Error' }] },
        { data: null },
      ]),
    ).toEqual([{ id: '1', type: 'foo' }, { errors: [{ detail: 'Error' }] }])
  })
})
