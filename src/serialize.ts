/**
 * Serialize data into a JSON-API structure
 *
 * @param {object} values - resource attributes
 * @param {object} state - store state
 * @returns {object}
 */
export function serialize(
  values,
  { dateFields = [], protectedFields = [], type },
) {
  const attributes = {}
  const relationships = {}

  Object.keys(values).forEach(key => {
    let value = values[key]

    if (RELATIONSHIP_TYPES.indexOf(key) > -1 && Array.isArray(value)) {
      relationships[key] = {
        data: value.map(item => ({ id: item.id, type: item.type })),
      }
    }

    // Remove fields that are not allowed to be updated/inserted
    if (protectedFields.indexOf(key) === -1 && typeof value !== 'undefined') {
      // Convert dates to epoch time for Elide
      if (dateFields.indexOf(key) > -1) {
        const timestamp = Date.parse(value)

        if (!isNaN(timestamp)) {
          value = timestamp
        }
      }

      attributes[key] = value
    }
  })

  const result = { attributes, relationships, type }

  if (values.id) {
    result.id = values.id
  }

  //console.log('serialize', { result })

  return result
}
