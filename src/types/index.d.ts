import { ResourceObject } from 'ts-json-api'

export declare type Attribute = string | number | boolean | object | undefined

export interface Attributes {
  [index: string]: Attribute
}

export interface NormalizedResource {
  id?: string
  type: string
  [index: string]: Attribute
}

export declare type Params = {
  fields?: string | Attributes
  filter?: string | Attributes
  include?: string | string[]
  page?: number
  pageSize?: number
  sort?: string | string[]
}

export declare type Operation = 'add' | 'remove' | 'replace'

export declare type MutationResource = {
  op: Operation
  path: string
  value: ResourceObject
}
