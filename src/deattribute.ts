import { isArray, isPlainObject } from 'ts-util-is'
import { PrimaryData } from 'jsonapi-typescript'

/*interface Data {
  id: string,
  type: string,
  attributes: object,
  [key: string]: any;
}*/

export default async function deattribute(data?: PrimaryData) {
  if (isArray(data)) {
    await data.map(async el => deattribute(el))
    
  } else if (isPlainObject(data) && isPlainObject(data.attributes)) {
    Object.keys(data.attributes).forEach(key => { 
      data[key] = (<any>data.attributes)[key] 
    })
    delete data.attributes
  }

  return data
}