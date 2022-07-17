import { mock, resetMocks } from '@depay/web3-mock'
import { request, provider, resetCache } from 'src/'
import { struct, publicKey, u64, u32, u8, PublicKey } from '@depay/solana-web3.js'
import { supported } from 'src/blockchains'

describe('request getAccountInfo', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('should request account data implicitly if just the address is provided', async ()=> {

        let api = struct([ publicKey('mint'), publicKey('owner'), u64('amount'), u32('delegateOption'), publicKey('delegate'), u8('state'), u32('isNativeOption'), u64('isNative'), u64('delegatedAmount'), u32('closeAuthorityOption'), publicKey('closeAuthority')])

        let requestMock = mock({
          provider: provider(blockchain),
          blockchain,
          request: {
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

        let data = await request('solana://2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9', { api })

        expect(data.mint.toString()).toEqual('8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r')
        expect(data.owner.toString()).toEqual('Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX')
        expect(data.amount.toString()).toEqual('2511210038936013080')
        expect(data.delegateOption).toEqual(70962703)
        expect(data.delegate.toString()).toEqual('BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR')
        expect(data.state).toEqual(0)
        expect(data.isNativeOption).toEqual(0)
        expect(data.isNative.toString()).toEqual('0')
        expect(data.delegatedAmount.toString()).toEqual('0')
        expect(data.closeAuthorityOption).toEqual(0)
        expect(data.closeAuthority.toString()).toEqual('11111111111111111111111111111111')
      })

      it('should request account data explicitly too', async ()=> {

        let api = struct([ publicKey('mint'), publicKey('owner'), u64('amount'), u32('delegateOption'), publicKey('delegate'), u8('state'), u32('isNativeOption'), u64('isNative'), u64('delegatedAmount'), u32('closeAuthorityOption'), publicKey('closeAuthority')])

        let requestMock = mock({
          provider: provider(blockchain),
          blockchain,
          request: {
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

        let data = await request('solana://2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9/getAccountInfo', { api })

        expect(data.mint.toString()).toEqual('8rUUP52Bb6Msg6E14odyPWUFafi5wLEMpLjtmNfBp3r')
        expect(data.owner.toString()).toEqual('Cq7CPoJ3b84nANKnz61HCCywSMVJNbRzmoaqvAxBi4vX')
        expect(data.amount.toString()).toEqual('2511210038936013080')
        expect(data.delegateOption).toEqual(70962703)
        expect(data.delegate.toString()).toEqual('BSFGxQ38xesdoUd3qsvNhjRu2FLPq9CwCBiGE42fc9hR')
        expect(data.state).toEqual(0)
        expect(data.isNativeOption).toEqual(0)
        expect(data.isNative.toString()).toEqual('0')
        expect(data.delegatedAmount.toString()).toEqual('0')
        expect(data.closeAuthorityOption).toEqual(0)
        expect(data.closeAuthority.toString()).toEqual('11111111111111111111111111111111')
      })

      it('should fail', async ()=> {

        let api = struct([ publicKey('mint'), publicKey('owner'), u64('amount'), u32('delegateOption'), publicKey('delegate'), u8('state'), u32('isNativeOption'), u64('isNative'), u64('delegatedAmount'), u32('closeAuthorityOption'), publicKey('closeAuthority')])

        let requestMock = mock({
          provider: provider(blockchain),
          blockchain,
          request: {
            method: 'getAccountInfo',
            to: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
            api,
            return: Error('SOMETHING WENT WRONG')
          }
        })

        await expect(
          request('solana://2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9', { api })
        ).rejects.toEqual(Error('failed to get info about account 2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9: SOMETHING WENT WRONG'))
      })
    })
  })
})
