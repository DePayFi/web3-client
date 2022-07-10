import { mock, resetMocks, increaseBlock } from '@depay/web3-mock'
import { request, provider, resetCache } from 'src/'
import { supported } from 'src/blockchains'

describe('request', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=> {

      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, provider: provider(blockchain)}))

      it('provides latest block number', async ()=> {
        let blockNumber = await request(`${blockchain}://latestBlockNumber`)
        expect(blockNumber).toEqual(1)
      })

      it('resets providers between specs to reset block numbers', async ()=> {
        increaseBlock(9)
        let blockNumber = await request(`${blockchain}://latestBlockNumber`)
        expect(blockNumber).toEqual(10)
      })

      it('resets providers between specs to reset block numbers', async ()=> {
        increaseBlock(9)
        let blockNumber = await request(`${blockchain}://latestBlockNumber`)
        expect(blockNumber).toEqual(10)
      })
    })
  })
})
