import { mock, resetMocks } from '@depay/web3-mock'
import { simulate, getProvider, resetCache } from 'src/'
import { struct, u8 } from '@depay/solana-web3.js'
import { supported } from 'src/blockchains'

describe('simulate', () => {

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

      it('simulates a transaction', async ()=> {

        let mockedLogs = [`Program log: GetPoolData: {"status":1,"coin_decimals":9,"pc_decimals":6,"lp_decimals":9,"pool_pc_amount":263577512770802,"pool_coin_amount":263577512770802,"pool_lp_supply":263577512770802,"pool_open_time":0,"amm_id":"58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"}`]
        let api = struct([ u8("instruction"), u8("simulateType") ])

        mock({
          blockchain,
          provider,
          simulate: {
            from: 'RaydiumSimuLateTransaction11111111111111111',
            instructions: [{
              to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
              api
            }],
            return: { logs: mockedLogs }
          },
        })

        let { logs } = await simulate({
          blockchain: 'solana',
          from: 'RaydiumSimuLateTransaction11111111111111111',
          to: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
          keys: [
            { pubkey: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2", isWritable: false, isSigner: false },
            { pubkey: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", isWritable: false, isSigner: false },
            { pubkey: "HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc", isWritable: false, isSigner: false },
            { pubkey: "DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz", isWritable: false, isSigner: false },
            { pubkey: "HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz", isWritable: false, isSigner: false },
            { pubkey: "8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu", isWritable: false, isSigner: false },
            { pubkey: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT", isWritable: false, isSigner: false },
          ],
          api,
          params: { instruction: 12, simulateType: 0 }
        })

        expect(logs).toEqual(mockedLogs)
      })
    })
  })
})
