import Blockchains from '@depay/web3-blockchains'
import StaticJsonRpcBatchProvider from '../../clients/ethers/provider'
import { getWindow } from '../../window'

const getAllProviders = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {}
  }
  return getWindow()._Web3ClientProviders
}

const setProvider = (blockchain, provider)=> {
  if(getAllProviders()[blockchain] === undefined) { getAllProviders()[blockchain] = [] }
  getAllProviders()[blockchain][0] = provider
}

const setProviderEndpoints = async (blockchain, endpoints)=> {
  getAllProviders()[blockchain] = endpoints.map((endpoint)=>new StaticJsonRpcBatchProvider(endpoint, blockchain, endpoints))
  
  let provider
  let window = getWindow()

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined')
  ) {
    provider = getAllProviders()[blockchain][0]
  } else {
    
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
          body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
        })
        if(!response.ok) { return resolve(999) }
        let after = new Date().getTime()
        resolve(after-before)
      })
    }))

    const fastestResponse = Math.min(...responseTimes)
    const fastestIndex = responseTimes.indexOf(fastestResponse)
    provider = getAllProviders()[blockchain][fastestIndex]
  }
  
  setProvider(blockchain, provider)
}

const getProvider = async (blockchain)=> {

  let providers = getAllProviders()
  if(providers && providers[blockchain]){ return providers[blockchain][0] }
  
  let window = getWindow()
  if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

  if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {} }
  window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints(blockchain, Blockchains[blockchain].endpoints)
    resolve(getWindow()._Web3ClientProviders[blockchain][0])
  })

  return await window._Web3ClientGetProviderPromise[blockchain]
}

const getProviders = async(blockchain)=>{

  let providers = getAllProviders()
  if(providers && providers[blockchain]){ return providers[blockchain] }
  
  let window = getWindow()
  if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

  if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {} }
  window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints(blockchain, Blockchains[blockchain].endpoints)
    resolve(getWindow()._Web3ClientProviders[blockchain])
  })

  return await window._Web3ClientGetProvidersPromise[blockchain]
}

export default {
  getProvider,
  getProviders,
  setProviderEndpoints,
  setProvider,
}
