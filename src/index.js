/*#if _EVM

const simulate = undefined

/*#elif _SVM

import simulate from './simulate'

//#else */

import simulate from './simulate'

//#endif

import estimate from './estimate'
import request from './request'
import rpcRequest from './rpcRequest'
import { getProvider, getProviders, setProviderEndpoints, setProvider } from './provider'
import { resetCache } from './cache'
import { setConfiguration } from './configuration'

export { 
  request,
  rpcRequest,
  estimate,
  simulate,
  getProvider,
  getProviders,
  setProviderEndpoints,
  setProvider,
  resetCache,
  setConfiguration,
}
