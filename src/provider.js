import { supported } from './blockchains'

import EVM from './platforms/evm/provider'
import Solana from './platforms/solana/provider'

const getProvider = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) {
    return await EVM.getProvider(blockchain)
  } else if(supported.solana.includes(blockchain)) {
    return await Solana.getProvider(blockchain)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) {
    return EVM.setProvider(blockchain, provider)
  } else if(supported.solana.includes(blockchain)) {
    return Solana.setProvider(blockchain, provider)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints)=>{

  if(supported.evm.includes(blockchain)) {
    return EVM.setProviderEndpoints(blockchain, endpoints)
  } else if(supported.solana.includes(blockchain)) {
    return Solana.setProviderEndpoints(blockchain, endpoints)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
