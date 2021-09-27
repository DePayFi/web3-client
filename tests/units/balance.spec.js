import { request, provider } from 'src/'
import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'

describe('request balance', () => {

  ['ethereum', 'bsc'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('should request account balance on ethereum', async ()=> {

        mock({
          provider: provider('ethereum'),
          blockchain: 'ethereum',
          balance: {
            for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            return: '12345'
          }
        })
        
        let value = await request('ethereum://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/balance')
        expect(value).toEqual(ethers.BigNumber.from('12345'))
      });

      it('allows to request account balance also with deconstructed URL on ethereum', async ()=> {

        mock({
          provider: provider('ethereum'),
          blockchain: 'ethereum',
          balance: {
            for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            return: '12345'
          }
        })
        
        let value = await request({ 
          blockchain: 'ethereum',
          address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
          method: 'balance'
        })
        expect(value).toEqual(ethers.BigNumber.from('12345'))
      })
    })
  })
})
