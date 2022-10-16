import { mock, resetMocks } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'src/'
import { struct, publicKey, u128, u64, u32, u8, seq, PublicKey, Buffer } from '@depay/solana-web3.js'
import { supported } from 'src/blockchains'

describe('request getProgramAccounts', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      let provider
      const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']

      beforeEach(async ()=>{
        resetMocks()
        resetCache()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })

      it.only('requests getProgramAccounts with given filters', async ()=> {

        let wallet = '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9'
        let mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        
        let filters = [
          { dataSize: 165 },
          { memcmp: { offset: 32, bytes: wallet }},
          { memcmp: { offset: 0, bytes: mint }}
        ]

        let requestMock = mock({
          provider,
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

      it('parses program accounts data if api is provided', async ()=> {

        // LIQUIDITY_STATE_LAYOUT_V4
        const api = struct([
          u64("status"),
          u64("nonce"),
          u64("maxOrder"),
          u64("depth"),
          u64("baseDecimal"),
          u64("quoteDecimal"),
          u64("state"),
          u64("resetFlag"),
          u64("minSize"),
          u64("volMaxCutRatio"),
          u64("amountWaveRatio"),
          u64("baseLotSize"),
          u64("quoteLotSize"),
          u64("minPriceMultiplier"),
          u64("maxPriceMultiplier"),
          u64("systemDecimalValue"),
          u64("minSeparateNumerator"),
          u64("minSeparateDenominator"),
          u64("tradeFeeNumerator"),
          u64("tradeFeeDenominator"),
          u64("pnlNumerator"),
          u64("pnlDenominator"),
          u64("swapFeeNumerator"),
          u64("swapFeeDenominator"),
          u64("baseNeedTakePnl"),
          u64("quoteNeedTakePnl"),
          u64("quoteTotalPnl"),
          u64("baseTotalPnl"),
          u128("quoteTotalDeposited"),
          u128("baseTotalDeposited"),
          u128("swapBaseInAmount"),
          u128("swapQuoteOutAmount"),
          u64("swapBase2QuoteFee"),
          u128("swapQuoteInAmount"),
          u128("swapBaseOutAmount"),
          u64("swapQuote2BaseFee"),
          // amm vault
          publicKey("baseVault"),
          publicKey("quoteVault"),
          // mint
          publicKey("baseMint"),
          publicKey("quoteMint"),
          publicKey("lpMint"),
          // market
          publicKey("openOrders"),
          publicKey("marketId"),
          publicKey("marketProgramId"),
          publicKey("targetOrders"),
          publicKey("withdrawQueue"),
          publicKey("lpVault"),
          publicKey("owner"),
          // true circulating supply without lock up
          u64("lpReserve"),
          seq(u64(), 3, "padding"),
        ])

        let filters = [
          { dataSize: api.span },
          { memcmp: { offset: 400, bytes: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' }},
          { memcmp: { offset: 432, bytes: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }}
        ]

        let requestMock = mock({
          provider,
          blockchain,
          request: {
            method: 'getProgramAccounts',
            to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
            params: { filters },
            return: [
              {
                account: { data: new Buffer([
                  1,0,0,0,0,0,0,0,254,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,64,66,15,0,0,0,0,0,0,0,0,0,0,0,0,0,136,19,0,0,0,0,0,0,64,66,15,0,0,0,0,0,100,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,202,154,59,0,0,0,0,64,66,15,0,0,0,0,0,5,0,0,0,0,0,0,0,16,39,0,0,0,0,0,0,25,0,0,0,0,0,0,0,16,39,0,0,0,0,0,0,12,0,0,0,0,0,0,0,100,0,0,0,0,0,0,0,25,0,0,0,0,0,0,0,16,39,0,0,0,0,0,0,208,221,157,203,3,0,0,0,86,45,178,203,3,0,0,0,77,240,153,161,31,0,0,0,94,167,240,160,31,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,132,109,185,105,83,44,0,0,0,0,0,0,0,0,0,0,72,244,218,37,75,44,0,0,0,0,0,0,0,0,0,0,28,249,236,21,27,0,0,0,29,238,144,55,82,42,0,0,0,0,0,0,0,0,0,0,45,70,98,59,50,42,0,0,0,0,0,0,0,0,0,0,23,235,33,110,28,0,0,0,204,213,174,55,220,158,5,173,185,209,151,174,210,90,241,181,20,130,121,205,122,100,199,174,95,220,51,230,11,89,156,86,252,83,121,186,29,4,22,69,224,123,82,67,152,232,56,99,24,54,234,221,42,171,71,244,135,32,152,2,123,232,86,166,206,1,14,96,175,237,178,39,23,189,99,25,47,84,20,90,63,150,90,51,187,130,210,199,2,158,178,206,30,32,130,100,198,250,122,243,190,219,173,58,61,101,243,106,171,201,116,49,177,187,228,194,210,246,224,228,124,166,2,3,69,47,93,97,250,46,103,104,137,38,197,128,95,210,46,96,63,177,59,136,36,193,170,49,210,200,153,39,234,165,68,107,233,73,174,130,82,28,210,206,238,146,191,57,27,228,217,150,3,204,201,166,179,164,207,27,89,169,25,63,145,34,113,71,228,96,176,142,90,230,231,145,161,67,118,102,175,251,217,103,212,238,138,135,81,36,81,20,36,164,54,82,191,180,3,74,192,252,128,175,133,15,45,110,2,164,122,248,36,208,154,182,157,196,45,112,203,40,203,250,36,159,183,238,87,185,210,86,193,39,98,239,141,139,198,234,134,166,229,237,135,163,186,152,104,18,150,124,140,232,224,121,98,15,224,175,67,214,68,171,156,49,131,154,246,82,93,2,250,14,92,176,182,202,89,36,215,221,223,199,230,137,32,41,36,205,30,169,70,207,75,154,115,205,83,254,36,133,132,6,21,100,29,21,26,205,45,115,252,140,113,93,199,121,139,185,155,109,63,157,139,47,197,54,43,230,0,148,247,229,12,130,182,253,3,145,221,190,142,196,175,233,38,7,216,6,102,240,12,234,145,131,255,47,132,7,62,19,133,181,140,117,247,215,18,0,0,0,195,39,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
                ]), executable: false, lamports: 2039280, owner: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', rentEpoch: 327 },
                pubkey: '7TbGqz32RsuwXbXY7EyBCiAnMbJq1gm1wKmfjQjuwoyF'
              }
            ]
          }
        })

        let accounts = await request('solana://675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8/getProgramAccounts', {
          params: { filters }, api
        })
        
        expect(accounts[0].data.baseMint.toString()).toEqual('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB')
        expect(accounts[0].data.quoteMint.toString()).toEqual('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      })
    })
  })
})
