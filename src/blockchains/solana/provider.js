import {
  getProvider as getProviderFactory,
  setProviderEndpoints as setProviderEndpointsFactory,
  setProvider as setProviderFactory,
} from '../../platforms/solana/provider'

const blockchain = 'solana'
const endpoints = ['https://solana-mainnet.phantom.tech', 'https://solana-api.projectserum.com', 'https://ssc-dao.genesysgo.net']

const setProvider = setProviderFactory(blockchain)
const setProviderEndpoints = setProviderEndpointsFactory(blockchain, setProvider)
const getProvider = getProviderFactory(blockchain, endpoints, setProviderEndpoints)

export {
  getProvider,
  setProvider,
  setProviderEndpoints,
}
