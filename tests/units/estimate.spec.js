import { mock, resetMocks } from 'depay-web3mock'
import { estimate } from 'dist/cjs/index.js'

describe('estimate transactions', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  let api = [{"inputs":[{"internalType":"address","name":"_configuration","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"configuration","outputs":[{"internalType":"contract DePayRouterV1Configuration","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"pluginAddress","type":"address"}],"name":"isApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"address[]","name":"plugins","type":"address[]"},{"internalType":"string[]","name":"data","type":"string[]"}],"name":"route","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  
  it('allows you to estimate transactions', async ()=> {

    let estimationMock = mock({
      blockchain: 'ethereum',
      estimate: {
        api,
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        method: 'route',
        params: {
          path: ['0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC'],
          amounts: ['160000000000000000', '160000000000000000', '1626096776'],
          addresses: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'],
          plugins: ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'],
          data: []
        },
        return: '123333'
      }
    })
    
    let cost = await estimate('ethereum://0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92/route', {
      api,
      params: {
        path: ['0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC'],
        amounts: ['160000000000000000', '160000000000000000', '1626096776'],
        addresses: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'],
        plugins: ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'],
        data: []
      },
      value: 0
    })

    expect(cost.toString()).toEqual('123333')
  });

  it('rejects the promise in case the transaction is not possible with a reason', async ()=> {

    mock({
      blockchain: 'ethereum',
      estimate: {
        api,
        to: '0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92',
        method: 'route',
        params: {
          path: ['0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC'],
          amounts: ['160000000000000000', '160000000000000000', '1626096776'],
          addresses: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'],
          plugins: ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'],
          data: []
        },
        return: Error('Transaction not possible!')
      }
    })

    await expect(
      estimate('ethereum://0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92/route', {
        api,
        params: {
          path: ['0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC'],
          amounts: ['160000000000000000', '160000000000000000', '1626096776'],
          addresses: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'],
          plugins: ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'],
          data: []
        },
        value: 0
      })
    ).rejects.toEqual(new Error('Transaction not possible!'))
  })

  it('rejects the promise in case no wallet is connected', async ()=> {
    await expect(
      estimate('ethereum://0xae60aC8e69414C2Dc362D0e6a03af643d1D85b92/route', {
        api,
        params: {
          path: ['0x1cBb83EbcD552D5EBf8131eF8c9CD9d9BAB342bC'],
          amounts: ['160000000000000000', '160000000000000000', '1626096776'],
          addresses: ['0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'],
          plugins: ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'],
          data: []
        },
        value: 0
      })
    ).rejects.toEqual('No wallet connected!')
  })
});
