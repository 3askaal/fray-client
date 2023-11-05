const { transform, toPairs, isObject } = require('lodash')

const deepTransform = (obj: any, iterator: any) => transform(obj, (acc: any, val: any, key: any) => {
  // use the iterator and get a pair of key and value
  const pair = toPairs(iterator(key, val))[0]

  // if pair is undefined, continue to next iteration
  if (!pair) return

  // get the update key and value from the pair
  const [k, v] = pair

  acc[k] = isObject(v) ? deepTransform(v, iterator) : v
})

const iterator = (key: any, value: any) => {
  if (value && value.attributes) {
    const { attributes, ...rest } = value

    return {
      [key]: { ...attributes, ...rest }
    }
  }

  return { [key]: value }
}

export function formatResponse(response: any) {
  return deepTransform(response, iterator);
}
