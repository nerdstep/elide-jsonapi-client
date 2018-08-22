import { ApiError } from './typings'

/**
 * Destructures an Axios response error
 *
 * @param err Request error response
 * @throws The mutated Error
 */
export function error(err: ApiError) {
  let {
    response: {
      data: { errors = [], error = '', message = '' } = {},
      status = 500,
      statusText = 'Error',
    } = {},
  } = err

  // Handle Elide server errors
  if (errors.length === 0 && (error || message)) {
    statusText = error
    errors.push(message)
  }

  Object.assign(err, {
    errors,
    status,
    statusText,
  })

  throw err
}
