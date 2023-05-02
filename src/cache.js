import { getWindow } from './window'

let getCacheStore = () => {
  if (getWindow()._Web3ClientCacheStore == undefined) {
    getWindow()._Web3ClientCacheStore = {}
  }
  return getWindow()._Web3ClientCacheStore
}

let getPromiseStore = () => {
  if (getWindow()._Web3ClientPromiseStore == undefined) {
    getWindow()._Web3ClientPromiseStore = {}
  }
  return getWindow()._Web3ClientPromiseStore
}

let resetCache = () => {
  getWindow()._Web3ClientCacheStore = {}
  getWindow()._Web3ClientPromiseStore = {}
  getWindow()._Web3ClientProviders = {}
  getWindow()._Web3ClientGetProviderPromise = undefined
}

let set = function ({ key, value, expires }) {
  getCacheStore()[key] = {
    expiresAt: Date.now() + expires,
    value,
  }
}

let get = function ({ key, expires }) {
  let cachedEntry = getCacheStore()[key]
  if (cachedEntry?.expiresAt > Date.now()) {
    return cachedEntry.value
  }
}

let getPromise = function({ key }) {
  return getPromiseStore()[key]
}

let setPromise = function({ key, promise }) {
  getPromiseStore()[key] = promise
  return promise
}

let deletePromise = function({ key }) {
  getPromiseStore()[key] = undefined 
}

let cache = function ({ call, key, expires = 0 }) {
  return new Promise((resolve, reject)=>{
    let value
    key = JSON.stringify(key)
    
    // get existing promise (of a previous pending request asking for the exact same thing)
    let existingPromise = getPromise({ key })
    if(existingPromise) { 
      return existingPromise
        .then(resolve)
        .catch(reject)
    }

    setPromise({ key, promise: new Promise((resolveQueue, rejectQueue)=>{
      if (expires === 0) {
        return call()
          .then((value)=>{
            resolve(value)
            resolveQueue(value)
          })
          .catch((error)=>{
            reject(error)
            rejectQueue(error)
          })
      }
      
      // get cached value
      value = get({ key, expires })
      if (value) {
        resolve(value)
        resolveQueue(value)
        return value
      }

      // set new cache value
      call()
        .then((value)=>{
          if (value) {
            set({ key, value, expires })
          }
          resolve(value)
          resolveQueue(value)
        })
        .catch((error)=>{
          reject(error)
          rejectQueue(error)
        })
      })
    }).then(()=>{
      deletePromise({ key })
    }).catch(()=>{
      deletePromise({ key })
    })
  })
}

export { cache, resetCache }
