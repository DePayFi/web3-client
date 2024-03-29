import { ethers } from 'ethers'
import { mock, resetMocks } from '@depay/web3-mock'
import { request, resetCache, getProvider } from 'src/'
import { supported } from 'src/blockchains'

describe('cache', ()=>{

  supported.evm.forEach((blockchain)=>{

    const ERC20 = [{constant:true,inputs:[],name:'name',outputs:[{name:'',type:'string'}],payable:false,stateMutability:'view',type:'function',},{constant:false,inputs:[{name:'_spender',type:'address'},{name:'_value',type:'uint256'},],name:'approve',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function',},{constant:true,inputs:[],name:'totalSupply',outputs:[{name:'',type:'uint256'}],payable:false,stateMutability:'view',type:'function',},{constant:false,inputs:[{name:'_from',type:'address'},{name:'_to',type:'address'},{name:'_value',type:'uint256'},],name:'transferFrom',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function',},{constant:true,inputs:[],name:'decimals',outputs:[{name:'',type:'uint8'}],payable:false,stateMutability:'view',type:'function',},{constant:true,inputs:[{name:'_owner',type:'address'}],name:'balanceOf',outputs:[{name:'balance',type:'uint256'}],payable:false,stateMutability:'view',type:'function',},{constant:true,inputs:[],name:'symbol',outputs:[{name:'',type:'string'}],payable:false,stateMutability:'view',type:'function',},{constant:false,inputs:[{name:'_to',type:'address'},{name:'_value',type:'uint256'},],name:'transfer',outputs:[{name:'',type:'bool'}],payable:false,stateMutability:'nonpayable',type:'function',},{constant:true,inputs:[{name:'_owner',type:'address'},{name:'_spender',type:'address'},],name:'allowance',outputs:[{name:'',type:'uint256'}],payable:false,stateMutability:'view',type:'function',},{payable:true,stateMutability:'payable',type:'fallback'},{anonymous:false,inputs:[{indexed:true,name:'owner',type:'address'},{indexed:true,name:'spender',type:'address'},{indexed:false,name:'value',type:'uint256'},],name:'Approval',type:'event',},{anonymous:false,inputs:[{indexed:true,name:'from',type:'address'},{indexed:true,name:'to',type:'address'},{indexed:false,name:'value',type:'uint256'},],name:'Transfer',type:'event',}]

    describe(blockchain, ()=> {

      let provider
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

      beforeEach(async ()=>{
        resetMocks()
        resetCache()
        provider = await getProvider(blockchain)
        mock({ blockchain, provider, accounts: { return: accounts } })
      })

      let api = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

      let doRequestWithCache = async function(){
        return await request(`${blockchain}://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/getAmountsOut`, {
          cache: 1000,
          api,
          params: {
            amountIn: '1000000000000000000',
            path: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']
          }
        })
      }

      let doRequestWithoutCache = async function(){
        return await request(`${blockchain}://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/getAmountsOut`, {
          api,
          params: {
            amountIn: '1000000000000000000',
            path: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']
          }
        })
      }

      let mockCall = function(){
        return mock({
          provider,
          blockchain,
          request: {
            to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
            api,
            method: 'getAmountsOut',
            params: ['1000000000000000000', ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']],
            return: ['1000000000000000000', '1310652554072266033285']
          }
        })
      }

      it('it serves responses made in parallel from the same response promise lock', async ()=> {

        let callMock = mockCall()
        
        await Promise.all([doRequestWithoutCache(), doRequestWithoutCache(), doRequestWithoutCache()])
        expect(callMock).toHaveBeenCalledTimes(1)
        await new Promise((r) => setTimeout(r, 1000))
        await doRequestWithCache()
        expect(callMock).toHaveBeenCalledTimes(2)
      })

      it('serves responses made in parallel for various requests correctly', async ()=> {

        let decimalMock1 = mock({ provider, blockchain, request: { to: '0x6b175474e89094c44da98b954eedeac495271d0f', api: ERC20, method: 'decimals', return: '18' } })
        let decimalMock2 = mock({ provider, blockchain, request: { to: '0xdac17f958d2ee523a2206206994597c13d831ec7', api: ERC20, method: 'decimals', return: '6' } })
        let decimalMock3 = mock({ provider, blockchain, request: { to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', api: ERC20, method: 'decimals', return: '18' } })
        let decimalMock4 = mock({ provider, blockchain, request: { to: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', api: ERC20, method: 'decimals', return: '8' } })

        let decimals = await Promise.all([
          request({ blockchain, address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', method: 'decimals', api: ERC20, cache: 86400000 }),
          request({ blockchain, address: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', method: 'decimals', api: ERC20, cache: 86400000 }),
        ])

        expect(decimals).toEqual([18, 6, 18, 6, 18, 18, 8, 18, 8])

        expect(decimalMock1).toHaveBeenCalledTimes(1)
        expect(decimalMock2).toHaveBeenCalledTimes(1)
        expect(decimalMock3).toHaveBeenCalledTimes(1)
        expect(decimalMock4).toHaveBeenCalledTimes(1)
      })

      it('serves responses correctly even if some of them fail', async ()=>{

        let decimalMock1 = mock({ provider, blockchain, request: { to: '0x6b175474e89094c44da98b954eedeac495271d0f', api: ERC20, method: 'decimals', return: Error('something went wrong') } })
        let decimalMock2 = mock({ provider, blockchain, request: { to: '0xdac17f958d2ee523a2206206994597c13d831ec7', api: ERC20, method: 'decimals', return: '6' } })

        request({ blockchain, address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals' },{ api: ERC20, cache: 86400000 })
          .then(()=>{})
          .catch(()=>{})
        await request({ blockchain, address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals' },{ api: ERC20, cache: 86400000 })
      })
      
      it('it caches results until they expire', async ()=> {

        let callMock = mockCall()

        let value
        value = await doRequestWithCache()
        expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

        value = await doRequestWithCache()
        expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

        expect(callMock).toHaveBeenCalledTimes(1)

        await new Promise((r) => setTimeout(r, 2000))

        value = await doRequestWithCache()
        expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

        expect(callMock).toHaveBeenCalledTimes(2)
      })

      describe('resetCache', ()=>{

        beforeEach(async ()=>{
          resetMocks()
          resetCache()
          provider = await getProvider(blockchain)
          mock({ blockchain, provider, accounts: { return: accounts } })
        })

        it('does not cache across different tests', async ()=>{
          let callMock = mockCall()
          await doRequestWithCache()
          expect(callMock).toHaveBeenCalledTimes(1)
        })

        it('if reset inbetween with resetCache', async ()=>{
          let callMock = mockCall()
          await doRequestWithCache()
          expect(callMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
