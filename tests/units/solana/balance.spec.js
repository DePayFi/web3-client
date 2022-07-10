import { request, provider, resetCache } from 'src/'
import { ethers } from 'ethers'
import { mock, resetMocks } from '@depay/web3-mock'
import { supported } from 'src/blockchains'

describe('request balance', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('should request account balance', async ()=> {

        mock({
          provider: provider(blockchain),
          blockchain,
          balance: {
            for: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
            return: 12345
          }
        })
        
        let value = await request(`${blockchain}://2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1/balance`)
        expect(value).toEqual(12345)
      });

      it('allows to request account balance also with deconstructed URL', async ()=> {

        mock({
          provider: provider(blockchain),
          blockchain,
          balance: {
            for: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
            return: 12345
          }
        })
        
        let value = await request({ 
          blockchain,
          address: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
          method: 'balance'
        })
        expect(value).toEqual(12345)
      })
    })
  })
})
