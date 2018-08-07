import { AxiosError } from 'axios'

interface ApiError extends AxiosError {
  errors?: Array<object | string>
}

/**
 * Mutates an error and rethrows it
 *
 * @param err The Error
 * @throws The mutated Error
 */
export function error(err: ApiError) {
  if (err.response) {
    const e = err.response.data
    if (e && e.errors) err.errors = e.errors
  }
  throw err
}
