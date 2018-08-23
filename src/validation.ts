import { isPlainObject } from './util'
import { NormalizedResource, RelationshipRef } from './typings'

export const ID_REQUIRED = 'Resource must have an `id` property'
export const TYPE_REQUIRED = 'Resource must have a `type` property'
export const ID_TYPE_REQUIRED =
  'Relationship resource must have `id` and `type` properties'

export function validateResource(
  obj: NormalizedResource,
  idRequired?: boolean,
) {
  if (!isPlainObject(obj)) {
    throw new TypeError(`Expected an object but received \`${typeof obj}\``)
  } else if (idRequired && !obj.id) {
    throw new Error(ID_REQUIRED)
  } else if (!obj.type) {
    throw new Error(TYPE_REQUIRED)
  }
}

export function validateRelationship(obj: RelationshipRef) {
  if (!obj.id || !obj.type) {
    throw new Error(ID_TYPE_REQUIRED)
  }
}
