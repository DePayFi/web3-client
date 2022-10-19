import StaticJsonRpcBatchProvider from '../../clients/solana/provider'
import { getWindow } from '../../window'

const ENDPOINTS = {
  solana: ['https://solana-mainnet.phantom.tech', 'https://solana-api.projectserum.com', 'https://ssc-dao.genesysgo.net']
}

const getProviders = ()=> {
  if(getWindow()._clientProviders == undefined) {
    getWindow()._clientProviders = {}
  }
  return getWindow()._clientProviders
}

const setProvider = (blockchain, provider)=> {
  getProviders()[blockchain] = provider
}

const setProviderEndpoints = async (blockchain, endpoints)=> {
  
  let endpoint
  let window = getWindow()

  if(window.fetch != undefined) {
    
    let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
      return new Promise(async (resolve)=>{
        let timeout = 900
        let before = new Date().getTime()
        setTimeout(()=>resolve(timeout), timeout)
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' })
        })
        if(!response.ok) { return resolve(999) }
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
    blockchain,
    new StaticJsonRpcBatchProvider(endpoint, blockchain)
  )
}

const getProvider = async (blockchain)=> {

  let providers = getProviders()
    
  if(!providers || !providers[blockchain]) {
    await setProviderEndpoints(blockchain, ENDPOINTS[blockchain])
  }

  return getWindow()._clientProviders[blockchain]
}

export {
  getProvider,
  setProviderEndpoints,
  setProvider,
}
