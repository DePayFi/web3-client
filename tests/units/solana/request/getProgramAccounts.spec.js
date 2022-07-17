import { mock, resetMocks } from '@depay/web3-mock'
import { request, provider, resetCache } from 'src/'
import { struct, publicKey, u64, u32, u8, PublicKey, Buffer } from '@depay/solana-web3.js'
import { supported } from 'src/blockchains'

describe('request getProgramAccounts', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, accounts: { return: accounts } }))

      it('requests getProgramAccounts with given filters', async ()=> {

        let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        
        let filters = [
          { dataSize: 165 },
          { memcmp: { offset: 32, bytes: wallet }},
          { memcmp: { offset: 0, bytes: mint }}
        ]

        let requestMock = mock({
          provider: provider(blockchain),
          blockchain,
          request: {
            method: 'getProgramAccounts',
            to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            params: { filters },
            return: [
              {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ'
              }, {
                account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: mint, rentEpoch: 327 },
                pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
              }
            ]
          }
        })

        let accounts = await request('solana://TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA/getProgramAccounts', {
          params: { filters } 
        })
        
        expect(accounts.map((account)=>account.pubkey.toString())).toEqual([
          '3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb',
          'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ',
          'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
        ])
      })
    })
  })
})
