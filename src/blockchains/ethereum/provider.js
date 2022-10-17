import {
  getProvider as getProviderFactory,
  setProviderEndpoints as setProviderEndpointsFactory,
  setProvider as setProviderFactory,
} from '../../platforms/evm/provider'

const blockchain = 'ethereum'
const endpoints = ['https://cloudflare-eth.com', 'https://eth-mainnet.public.blastapi.io', 'https://eth-rpc.gateway.pokt.network']

const setProvider = setProviderFactory(blockchain)
const setProviderEndpoints = setProviderEndpointsFactory(blockchain, setProvider)
const getProvider = getProviderFactory(blockchain, endpoints, setProviderEndpoints)

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
