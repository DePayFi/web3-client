import StaticJsonRpcBatchProvider from '../../clients/ethers/provider'
import { getWindow } from '../../window'

const ENDPOINTS = {
  ethereum: ['https://cloudflare-eth.com', 'https://eth-mainnet.public.blastapi.io', 'https://eth-rpc.gateway.pokt.network'],
  bsc: ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed3.defibit.io'],
  polygon: ['https://polygon-rpc.com', 'https://rpc-mainnet.matic.quiknode.pro', 'https://matic-mainnet.chainstacklabs.com'],
  velas: ['https://mainnet.velas.com/rpc', 'https://evmexplorer.velas.com/rpc', 'https://explorer.velas.com/rpc'],
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

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined')
  ) {
    endpoint = endpoints[0]
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
    endpoint = endpoints[fastestIndex]
  }
  
  setProvider(
    blockchain,
    new StaticJsonRpcBatchProvider(endpoint, blockchain)
  )
}

const getProvider = (blockchain)=> {

  let providers = getProviders()
  if(providers && providers[blockchain]){ return Promise.resolve(providers[blockchain]) }
  
  let window = getWindow()
  if(window._getProviderPromise && window._getProviderPromise[blockchain]) { return Promise.resolve(window._getProviderPromise[blockchain]) }

  if(!window._getProviderPromise){ window._getProviderPromise = {} }
  window._getProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints(blockchain, ENDPOINTS[blockchain])
    resolve(getWindow()._clientProviders[blockchain])
  })

  return window._getProviderPromise[blockchain]
}

export {
  getProvider,
  setProviderEndpoints,
  setProvider,
}
