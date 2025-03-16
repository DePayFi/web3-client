import { mock, resetMocks } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'dist/esm/index.svm'
import { struct, publicKey, u64, u32, u8, PublicKey } from '@depay/solana-web3.js'
import { supported } from 'src/blockchains'

describe('request getAccountInfo', () => {

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']

      beforeEach(async ()=>{
        resetMocks()
        resetCache()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })

      it('raises a timeout if things take to long', async ()=> {

        let api = struct([ publicKey('mint'), publicKey('owner'), u64('amount'), u32('delegateOption'), publicKey('delegate'), u8('state'), u32('isNativeOption'), u64('isNative'), u64('delegatedAmount'), u32('closeAuthorityOption'), publicKey('closeAuthority')])

        let requestMock = mock({
          provider,
          blockchain,
          request: {
            delay: 2000,
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: {
              mint: '8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r',
              owner: 'Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX',
              amount: '2511210038936013080',
              delegateOption: 70962703,
              delegate: 'BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR',
              state: 0,
              isNativeOption: 0,
              isNative: '0',
              delegatedAmount: '0',
              closeAuthorityOption: 0,
              closeAuthority: '11111111111111111111111111111111'
            }
          }
        })

        await expect(
          request('solana://2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9', { timeout: 100 })
        ).rejects.toEqual(Error('Web3ClientTimeout'))
      })
    })
  })
})
