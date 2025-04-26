/*#if _EVM

import rpcRequestEVM from './platforms/evm/rpcRequest'

/*#elif _SVM

import rpcRequestSolana from './platforms/solana/rpcRequest'

//#else */

import rpcRequestEVM from './platforms/evm/rpcRequest'
import rpcRequestSolana from './platforms/solana/rpcRequest'

//#endif

import { supported } from './blockchains'

const rpcRequest = async function (request, options) {
  
  if(supported.evm.includes(request.blockchain)) {

    /*#if _EVM

    return await rpcRequestEVM({ blockchain: request.blockchain, request, timeout: options?.timeout, strategy: options?.strategy })

    /*#elif _SVM

    //#else */

    return await rpcRequestEVM({ blockchain: request.blockchain, request, timeout: options?.timeout, strategy: options?.strategy })

    //#endif

  } else if(supported.svm.includes(request.blockchain)) {

    /*#if _EVM

    /*#elif _SVM

    return await rpcRequestSolana({ blockchain: request.blockchain, request, timeout: options?.timeout, strategy: options?.strategy })

    //#else */

    return await rpcRequestSolana({ blockchain: request.blockchain, request, timeout: options?.timeout, strategy: options?.strategy })

    //#endif

  } else {
    throw 'Unknown blockchain: ' + request.blockchain
  }  
}

export default rpcRequest
