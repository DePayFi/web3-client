/*#if _EVM

const simulate = undefined

/*#elif _SVM

import simulate from './simulate'

//#else */

import simulate from './simulate'

//#endif

import estimate from './estimate'
import request from './request'
import { getProvider, getProviders, setProviderEndpoints, setProvider } from './provider'
import { resetCache } from './cache'
import { setConfiguration } from './configuration'

export { 
  request,
  estimate,
  simulate,
  getProvider,
  getProviders,
  setProviderEndpoints,
  setProvider,
  resetCache,
  setConfiguration,
}
