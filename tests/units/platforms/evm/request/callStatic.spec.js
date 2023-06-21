import { ethers } from 'ethers'
import { mock, resetMocks, connect } from '@depay/web3-mock'
import { request, getProvider, resetCache } from 'src/'
import { supported } from 'src/blockchains'

describe('callStatic', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=> {
      beforeEach(resetMocks)
      beforeEach(resetCache)

      let provider
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

      beforeEach(async ()=>{
        resetMocks()
        resetCache()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })

      it('should request blockchain data via callStatic', async ()=> {

        let api = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"quoteExactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},{"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IQuoterV2.QuoteExactInputSingleParams","name":"params","type":"tuple"}],"name":"quoteExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},{"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"quoteExactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},{"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IQuoterV2.QuoteExactOutputSingleParams","name":"params","type":"tuple"}],"name":"quoteExactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},{"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"path","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"view","type":"function"}]
        const path = ethers.utils.solidityPack(["address","uint24","address"],['0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',3000,'0x6b175474e89094c44da98b954eedeac495271d0f'])

        mock({
          blockchain,
          provider,
          request: {
            to: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
            api,
            method: 'quoteExactInput',
            params: [path, '100000000000000000000'],
            return: ['16708429622155241142', ['193785372217458754790946913570'], [0], '81243']
          }
        })
        
        let data = await request({
          blockchain,
          address: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
          method: 'quoteExactInput',
          api,
          params: {
            path: path,
            amountIn: '100000000000000000000'
          }
        })

        expect(data.amountOut.toString()).toEqual('16708429622155241142')
        expect(data.sqrtPriceX96AfterList[0].toString()).toEqual('193785372217458754790946913570')
        expect(data.initializedTicksCrossedList[0]).toEqual(0)
        expect(data.gasEstimate.toString()).toEqual('81243')
      })
    })
  })
})
