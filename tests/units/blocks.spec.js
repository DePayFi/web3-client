import { mock, resetMocks } from '@depay/web3-mock'
import { request, provider, resetCache } from 'src/'

describe('request', () => {

  ['ethereum', 'bsc', 'polygon'].forEach((blockchain)=>{

    describe(blockchain, ()=> {

      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      beforeEach(resetMocks)
      beforeEach(resetCache)
      beforeEach(()=>mock({ blockchain, provider: provider(blockchain), accounts: { return: accounts } }))

      it('provides latest block number', async ()=> {
        let blockNumber = await request(`${blockchain}://latestBlockNumber`)
        expect(blockNumber).toEqual(1)
      })
    })
  })
})
