import {
  getProvider as getProviderFactory,
  setProviderEndpoints as setProviderEndpointsFactory,
  setProvider as setProviderFactory,
} from '../../platforms/evm/provider'

const blockchain = 'bsc'
const endpoints = ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed3.defibit.io']

const setProvider = setProviderFactory(blockchain)
const setProviderEndpoints = setProviderEndpointsFactory(blockchain, setProvider)
const getProvider = getProviderFactory(blockchain, endpoints, setProviderEndpoints)

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
