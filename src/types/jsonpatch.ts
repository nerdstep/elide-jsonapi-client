/**
 * JSON Patch Extension Typings
 */
import { Error, ResourceObject } from './jsonapi'

/**
 * Operation Type constants
 */
export declare type OperationType = 'add' | 'remove' | 'replace'

/**
 * A Resource Operation
 */
export declare type Operation = {
  op: OperationType
  path: string
  value: ResourceObject
}

/**
 * An array of Operations
 */
export declare type Operations = Operation[]

/**
 * A Response Object
 */
export interface ResponseObject {
  data?: ResourceObject
  errors?: [Error]
}

/**
 * A Response from a JSON Patch Extension request
 */
export declare type Response = ResponseObject[]
