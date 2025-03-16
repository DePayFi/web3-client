/*#if _EVM

import EVM from './platforms/evm/provider'

/*#elif _SVM

import Solana from './platforms/solana/provider'

//#else */

import EVM from './platforms/evm/provider'
import Solana from './platforms/solana/provider'

//#endif

import { supported } from './blockchains'
import { resetCache } from './cache'

const getProvider = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return await EVM.getProvider(blockchain)

    /*#elif _SVM

    //#else */

    return await EVM.getProvider(blockchain)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SVM

    return await Solana.getProvider(blockchain)

    //#else */

    return await Solana.getProvider(blockchain)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const getProviders = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return await EVM.getProviders(blockchain)

    /*#elif _SVM

    //#else */

    return await EVM.getProviders(blockchain)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SVM

    return await Solana.getProviders(blockchain)

    //#else */

    return await Solana.getProviders(blockchain)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return EVM.setProvider(blockchain, provider)

    /*#elif _SVM

    //#else */

    return EVM.setProvider(blockchain, provider)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SVM

    return Solana.setProvider(blockchain, provider)

    //#else */

    return Solana.setProvider(blockchain, provider)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints, detectFastest)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return EVM.setProviderEndpoints(blockchain, endpoints, detectFastest)

    /*#elif _SVM

    //#else */

    return EVM.setProviderEndpoints(blockchain, endpoints, detectFastest)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM


    /*#elif _SVM

    return Solana.setProviderEndpoints(blockchain, endpoints, detectFastest)

    //#else */

    return Solana.setProviderEndpoints(blockchain, endpoints, detectFastest)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  getProvider,
  getProviders,
  setProvider,
  setProviderEndpoints,
}
