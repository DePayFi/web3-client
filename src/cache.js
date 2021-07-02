let cacheStore = {}

let resetCache = () => {
  cacheStore = {}
}

let set = function ({ key, value, expires }) {
  cacheStore[key] = {
    expiresAt: Date.now() + expires,
    value,
  }
}

let get = function ({ key, expires }) {
  let cachedEntry = cacheStore[key]
  if (cachedEntry?.expiresAt > Date.now()) {
    return cachedEntry.value
  }
}

let cache = async function ({ call, key, expires = 0 }) {
  if (expires === 0) {
    return call()
  }

  let value
  key = JSON.stringify(key)

  // get cached value
  value = get({ key, expires })
  if (value) {
    return value
  }

  // set new cache value
  value = await call()
  if (value) {
    set({ key, value, expires })
  }

  return value
}

export { cache, resetCache }
