import { supported } from './blockchains.evm'

import {
  getProvider as getProviderEVM,
  setProviderEndpoints as setProviderEndpointsEVM,
  setProvider as setProviderEVM,
} from './platforms/evm/provider'

const getProvider = (blockchain)=>{

  if(supported.evm.includes(blockchain)) {
    return getProviderEVM(blockchain)
  } else if(supported.solana.includes(blockchain)) {
    return getProviderSolana(blockchain)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) {
    return setProviderEVM(blockchain, provider)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints)=>{

  if(supported.evm.includes(blockchain)) {
    return setProviderEndpointsEVM(blockchain, endpoints)
  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
