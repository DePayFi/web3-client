import { supported } from './blockchains.evm'

import EVM from './platforms/evm/provider'

const getProvider = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) {
    return await EVM.getProvider(blockchain)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) {
    return EVM.setProvider(blockchain, provider)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints)=>{

  if(supported.evm.includes(blockchain)) {
    return EVM.setProviderEndpoints(blockchain, endpoints)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
