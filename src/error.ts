import { AxiosError } from 'axios'

interface ApiError extends AxiosError {
  errors?: Array<object | string>
}

/**
 * Destructures an Axios response error
 *
 * @param err Request error response
 * @throws The mutated Error
 */
export function error(err: ApiError) {
  const {
    response: {
      data: { errors = [] } = {},
      status = 500,
      statusText = 'Error',
    } = {},
  } = err

  Object.assign(err, {
    errors,
    status,
    statusText,
  })

  throw err
}
