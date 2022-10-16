import StaticJsonRpcBatchProvider from '../../clients/solana/provider'
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
    setProvider(
      new StaticJsonRpcBatchProvider(
        endpoints[0], blockchain
      )
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
