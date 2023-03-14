import { mock, resetMocks, increaseBlock } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'dist/esm/index.evm'
import { supported } from 'src/blockchains'

describe('blocks (evm)', ()=>{

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
