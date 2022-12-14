import { ethers } from 'ethers'
import { mock, resetMocks } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'src'
import { supported } from 'src/blockchains'

describe('transactionCount', ()=>{

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      
      beforeEach(async ()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })

      it('provides transactionCount', async ()=> {

        let count = await request(`${blockchain}://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/transactionCount`)
        expect(count).toEqual(0)
      })
    })
  })
})
