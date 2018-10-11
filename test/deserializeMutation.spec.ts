import { deserializeMutation } from '../src/deserializeMutation'

describe('deserializeMutation', () => {
  it('should omit a falsy data value', () => {
    expect.assertions(1)
    expect(
      deserializeMutation([
        { data: { id: '1', type: 'foo' } },
        { errors: [{ detail: 'Error' }] },
        // @ts-ignore
        { data: null },
        { data: undefined },
        // @ts-ignore
        { data: false },
        // @ts-ignore
        { data: '' },
      ]),
    ).toEqual([{ id: '1', type: 'foo' }, { errors: [{ detail: 'Error' }] }])
  })
})
