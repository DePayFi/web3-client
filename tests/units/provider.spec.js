import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider, setProvider } from 'src/'

describe('request provider', () => {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))
      
      it('provides an StaticJsonRpcBatchProvider per default on ethereum', async ()=> {
        let selectedProvider = await provider('ethereum');
        expect(
          !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('StaticJsonRpcBatchProvider')
        ).toEqual(true)
      })

      it('allows to set another provider', async ()=> {
        setProvider('ethereum', ['http://localhost:8545'])
        let selectedProvider = await provider('ethereum')
        expect(selectedProvider.connection.url).toEqual('http://localhost:8545')
      })
    })
  })
})
