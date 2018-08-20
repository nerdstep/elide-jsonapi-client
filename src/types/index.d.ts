import { ResourceObject } from 'ts-json-api'
import { AxiosError } from 'axios'

/**
 * Errors
 */

export interface ApiError extends AxiosError {
  errors?: object[] | string[]
}

/**
 * Resources
 */

export declare type Attribute = string | number | boolean | object | undefined

export interface Attributes {
  [index: string]: Attribute
}

export interface NormalizedResource {
  id?: string
  type: string
  [index: string]: Attribute
}

export declare type Relationship = {
  id: string
  type: string
}

export interface RelationshipWithData {
  id: string
  type: string
  [index: string]: Attribute
}

export interface NormalizedRelationships {
  [index: string]: Relationship | Relationship[]
}

/**
 * Parameters
 */

export declare type Params = {
  fields?: Attributes
  filter?: Attributes
  include?: string | string[]
  page?: number
  pageSize?: number
  sort?: string | string[]
}

export declare type PageParams = {
  limit?: number
  number?: number
  offset?: number
  size?: number
  totals?: boolean
}

export interface ParamsObject {
  fields?: Attributes
  filter?: Attributes
  include?: string
  page?: PageParams
  sort?: string
  [index: string]: string | object | PageParams | undefined
}

/**
 * Options
 */

export declare type SerializeOptions = {
  dateAttrs?: string[]
  idRequired?: boolean
  protectedAttrs?: string[]
}

export declare type SerializeParamsOptions = {
  prefix?: boolean
  size?: number
  totals?: boolean
  type?: string
}

/**
 * Mutations
 */

export declare type Operation = 'add' | 'remove' | 'replace'

export declare type MutationResource = {
  op: Operation
  path: string
  value: ResourceObject
}
