import { deserializeMutation } from '../src/deserializeMutation'

describe('deserializeMutation', () => {
  it('should omit a falsy data value', () => {
    expect.assertions(1)
    expect(
      // @ts-ignore
      deserializeMutation([
        { data: { id: '1', type: 'foo' } },
        { errors: [{ detail: 'Error' }] },
        { data: null },
        { data: undefined },
        { data: false },
        { data: '' },
      ]),
    ).toEqual([{ id: '1', type: 'foo' }, { errors: [{ detail: 'Error' }] }])
  })
})
