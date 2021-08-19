import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { request, resetCache } from 'src/'
import { Token } from 'depay-web3-tokens'

describe('request cache on ethereum', () => {

  beforeEach(resetMocks)
  beforeEach(resetCache)
  afterEach(resetMocks)

  let api = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

  let doRequestWithCache = async function(){
    return await request('ethereum://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/getAmountsOut', {
      cache: 1000,
      api: api,
      params: {
        amountIn: '1000000000000000000',
        path: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']
      }
    })
  }

  let doRequestWithoutCache = async function(){
    return await request('ethereum://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/getAmountsOut', {
      api: api,
      params: {
        amountIn: '1000000000000000000',
        path: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']
      }
    })
  }

  let mockCall = function(){
    return mock({
      blockchain: 'ethereum',
      call: {
        to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
        api: api,
        method: 'getAmountsOut',
        params: ['1000000000000000000', ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0xa0bed124a09ac2bd941b10349d8d224fe3c955eb']],
        return: ['1000000000000000000', '1310652554072266033285']
      }
    });
  }

  it('it serves responses made in parallel from the same response promise lock on ethereum', async ()=> {

    let callMock = mockCall()
    
    await Promise.all([doRequestWithoutCache(), doRequestWithoutCache(), doRequestWithoutCache()])
    expect(callMock).toHaveBeenCalledTimes(1)
    await new Promise((r) => setTimeout(r, 1000))
    await doRequestWithCache()
    expect(callMock).toHaveBeenCalledTimes(2)
  })

  it('serves responses made in parallel for various requests correctly on ethereum', async ()=> {

    let decimalMock1 = mock({ blockchain: 'ethereum', call: { to: '0x6b175474e89094c44da98b954eedeac495271d0f', api: Token['ethereum'].DEFAULT, method: 'decimals', return: '18' } })
    let decimalMock2 = mock({ blockchain: 'ethereum', call: { to: '0xdac17f958d2ee523a2206206994597c13d831ec7', api: Token['ethereum'].DEFAULT, method: 'decimals', return: '6' } })
    let decimalMock3 = mock({ blockchain: 'ethereum', call: { to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', api: Token['ethereum'].DEFAULT, method: 'decimals', return: '18' } })
    let decimalMock4 = mock({ blockchain: 'ethereum', call: { to: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', api: Token['ethereum'].DEFAULT, method: 'decimals', return: '8' } })

    let decimals = await Promise.all([
      request({ blockchain: 'ethereum', address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
      request({ blockchain: 'ethereum', address: '0x3ab100442484dc2414aa75b2952a0a6f03f8abfd', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 }),
    ])

    expect(decimals).toEqual([18, 6, 18, 6, 18, 18, 8, 18, 8])

    expect(decimalMock1).toHaveBeenCalledTimes(1)
    expect(decimalMock2).toHaveBeenCalledTimes(1)
    expect(decimalMock3).toHaveBeenCalledTimes(1)
    expect(decimalMock4).toHaveBeenCalledTimes(1)
  })

  it('serves responses correctly even if some of them fail', async ()=>{

    let decimalMock1 = mock({ blockchain: 'ethereum', call: { to: '0x6b175474e89094c44da98b954eedeac495271d0f', api: Token['ethereum'].DEFAULT, method: 'decimals', return: Error('something went wrong') } })
    let decimalMock2 = mock({ blockchain: 'ethereum', call: { to: '0xdac17f958d2ee523a2206206994597c13d831ec7', api: Token['ethereum'].DEFAULT, method: 'decimals', return: '6' } })

    request({ blockchain: 'ethereum', address: '0x6b175474e89094c44da98b954eedeac495271d0f', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 })
      .then(()=>{})
      .catch(()=>{})
    await request({ blockchain: 'ethereum', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', method: 'decimals' },{ api: Token['ethereum'].DEFAULT, cache: 86400000 })
  })
  
  it('it caches results until they expire on ethereum', async ()=> {

    let callMock = mockCall()

    let value;
    value = await doRequestWithCache();
    expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

    value = await doRequestWithCache();
    expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

    expect(callMock).toHaveBeenCalledTimes(1)

    await new Promise((r) => setTimeout(r, 1000))

    value = await doRequestWithCache();
    expect(value).toEqual([ethers.BigNumber.from('1000000000000000000'), ethers.BigNumber.from('1310652554072266033285')])

    expect(callMock).toHaveBeenCalledTimes(2)
  });

  describe('resetCache on ethereum', ()=>{

    beforeEach(resetCache)

    it('does not cache across different tests', async ()=>{
      let callMock = mockCall();
      await doRequestWithCache();
      expect(callMock).toHaveBeenCalledTimes(1)
    })

    it('if reset inbetween with resetCache', async ()=>{
      let callMock = mockCall();
      await doRequestWithCache();
      expect(callMock).toHaveBeenCalledTimes(1)
    })
  });
});
