/**
 * Determines if a reference is an `Array`
 *
 * @param value Reference to check
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * Determines if a reference is an 'Object'
 *
 * @param value Reference to check
 */
export function isObject(value: any): value is object {
  return typeof value === 'object'
}

/**
 * Determines if a reference is a plain `Object`. A "plain" object is typically created by `{}` or
 * `new Object()`. Some types such as arrays and null, while technically objects, are not considered
 * plain objects.
 *
 * @param value Reference to check
 */
export function isPlainObject(value: any): value is object {
  return (
    isObject(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}
