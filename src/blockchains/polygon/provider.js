import {
  getProvider as getProviderFactory,
  setProviderEndpoints as setProviderEndpointsFactory,
  setProvider as setProviderFactory,
} from '../../platforms/evm/provider'

const blockchain = 'polygon'
const endpoints = ['https://polygon-rpc.com', 'https://rpc-mainnet.matic.quiknode.pro', 'https://matic-mainnet.chainstacklabs.com']

const setProvider = setProviderFactory(blockchain)
const setProviderEndpoints = setProviderEndpointsFactory(blockchain, setProvider)
const getProvider = getProviderFactory(blockchain, endpoints, setProviderEndpoints)

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
