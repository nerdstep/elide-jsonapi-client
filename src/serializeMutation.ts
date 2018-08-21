import { NormalizedResource } from './types'
import { Operation, OperationType } from './types/jsonpatch'

/**
 * Serializes normalized resources into a JSON API-PATCH structure
 *
 * Ref: {@link https://goo.gl/bB58Wg}
 *
 * @param op Operation to perform
 * @param path Resource path relative to the root URL
 * @param resources Resources to serialize
 */
export function serializeMutation(
  op: OperationType,
  path: string,
  resources: NormalizedResource[],
) {
  return resources.map(({ id, type, ...attributes }) => {
    if (op !== 'add' && !id) {
      throw new Error(
        `Resources in a \`${op}\` mutation must have an \`id\` property`,
      )
    }

    const data = {
      op,
      path,
      value: {
        id: op === 'add' ? '__id__' : id,
        type,
      },
    } as Operation

    if (Object.keys(attributes).length > 0) {
      data.value.attributes = { ...attributes }
    }

    return data
  })
}
