import StaticJsonRpcBatchProvider from '../../clients/ethers/provider'
import { getWindow } from '../../window'

const getProviders = ()=> {
  if(getWindow()._clientProviders == undefined) {
    getWindow()._clientProviders = {}
  }
  return getWindow()._clientProviders
}

const setProvider = (blockchain)=> {
  return (givenProvider)=>{
    getProviders()[blockchain] = givenProvider
  }
}

const setProviderEndpoints = (blockchain, setProvider)=> {
  
  return async (endpoints)=> {
    
    let endpoint
    let window = getWindow()

    if(window.fetch != undefined) {
      
      let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
        return new Promise(async (resolve)=>{
          let timeout = 900
          let before = new Date().getTime()
          setTimeout(()=>resolve(timeout), timeout)
          let result = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
          })
          if(response != 'ok') { return resolve(999) }
          let after = new Date().getTime()
          resolve(after-before)
        })
      }))

      const fastestResponse = Math.min(...responseTimes)
      const fastestIndex = responseTimes.indexOf(fastestResponse)
      endpoint = endpoints[fastestIndex]
    } else {
      endpoint = endpoints[0]
    }
    
    setProvider(
      new StaticJsonRpcBatchProvider(endpoint, blockchain)
    )
  }
}

const getProvider = (blockchain, defaultEndpoints, setProviderEndpoints)=> {

  return async()=> {
    let providers = getProviders()
    
    if(!providers || !providers[blockchain]) {
      await setProviderEndpoints(defaultEndpoints)
    }

    return getWindow()._clientProviders[blockchain]
  }
}

export {
  getProvider,
  setProviderEndpoints,
  setProvider,
}
