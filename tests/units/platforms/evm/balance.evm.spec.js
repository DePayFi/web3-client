import { ethers } from 'ethers'
import { mock, resetMocks } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'src/index.evm'
import { supported } from 'src/blockchains.evm'

describe('balance (evm)', ()=>{

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

      it('should request account balance', async ()=> {

        mock({
          provider,
          blockchain,
          balance: {
            for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            return: '12345'
          }
        })
        
        let value = await request(`${blockchain}://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/balance`)
        expect(value).toEqual(ethers.BigNumber.from('12345'))
      });

      it('allows to request account balance also with deconstructed URL', async ()=> {

        mock({
          provider,
          blockchain,
          balance: {
            for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            return: '12345'
          }
        })
        
        let value = await request({ 
          blockchain,
          address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
          method: 'balance'
        })
        expect(value).toEqual(ethers.BigNumber.from('12345'))
      })
    })
  })
})
