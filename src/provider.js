/*#if _EVM

import EVM from './platforms/evm/provider'

/*#elif _SOLANA

import Solana from './platforms/solana/provider'

//#else */

import EVM from './platforms/evm/provider'
import Solana from './platforms/solana/provider'

//#endif

import { supported } from './blockchains'

const getProvider = async (blockchain)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return await EVM.getProvider(blockchain)

    /*#elif _SOLANA

    //#else */

    return await EVM.getProvider(blockchain)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SOLANA

    return await Solana.getProvider(blockchain)

    //#else */

    return await Solana.getProvider(blockchain)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProvider = (blockchain, provider)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return EVM.setProvider(blockchain, provider)

    /*#elif _SOLANA

    //#else */

    return EVM.setProvider(blockchain, provider)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM

    /*#elif _SOLANA

    return Solana.setProvider(blockchain, provider)

    //#else */

    return Solana.setProvider(blockchain, provider)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

const setProviderEndpoints = (blockchain, endpoints)=>{

  if(supported.evm.includes(blockchain)) {

    /*#if _EVM

    return EVM.setProviderEndpoints(blockchain, endpoints)

    /*#elif _SOLANA

    //#else */

    return EVM.setProviderEndpoints(blockchain, endpoints)

    //#endif

  } else if(supported.solana.includes(blockchain)) {

    /*#if _EVM


    /*#elif _SOLANA

    return Solana.setProviderEndpoints(blockchain, endpoints)

    //#else */

    return Solana.setProviderEndpoints(blockchain, endpoints)

    //#endif

  } else {
    throw 'Unknown blockchain: ' + blockchain
  }
}

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
