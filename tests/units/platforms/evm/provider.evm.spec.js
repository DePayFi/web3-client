import { ethers } from 'ethers'
import { mock, resetMocks } from '@depay/web3-mock'
import { getProvider, setProvider, setProviderEndpoints, resetCache } from 'src/index.evm'
import { supported } from 'src/blockchains.evm'

describe('provider (evm)', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

      beforeEach(async ()=>{
        resetMocks()
        resetCache()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })
      
      it('provides an StaticJsonRpcBatchProvider per default', async ()=> {
        let selectedProvider = await getProvider(blockchain)
        expect(
          !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('StaticJsonRpcBatchProvider')
        ).toEqual(true)
      })

      it('allows to set provider endpoints', async ()=> {
        setProviderEndpoints(blockchain, ['http://localhost:8545'])
        let selectedProvider = await getProvider(blockchain)
        expect(selectedProvider.connection.url).toEqual('http://localhost:8545')
      })

      it('allows to set an initialized provider', async ()=> {
        let newProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 1)
        setProvider(blockchain, newProvider)
        let selectedProvider = await getProvider(blockchain)
        expect(selectedProvider.connection.url).toEqual('http://localhost:8545')
        // reset
        setProviderEndpoints(blockchain, ['http://localhost:8545'])
      })
    })
  })
})
