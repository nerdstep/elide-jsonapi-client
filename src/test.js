const normalize = require('jsonapi-normalizer')

const resource = require('../jsonapi-spec/resource.json')
const collection = require('../jsonapi-spec/collection.json')
const collection2 = require('../jsonapi-spec/collectionWithIncludes.json')

const normalized = normalize(collection)

console.log(JSON.stringify(normalized, null, 2))
