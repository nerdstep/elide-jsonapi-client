import { serializeMutation } from '../src/serializeMutation'

describe('serializeMutation', () => {
  it('should throw if id is missing', () => {
    expect.assertions(1)
    expect(() =>
      serializeMutation('remove', '', [
        {
          type: 'articles',
        },
      ]),
    ).toThrow()
  })
})
