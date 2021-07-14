import https from 'https'
import { request } from 'dist/cjs/index.js'
import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3mock'

describe('request balance', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('should request account balance on a blockchain', async ()=> {

    mock({
      blockchain: 'ethereum',
      balance: {
        for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
        return: '12345'
      }
    })
    
    let value = await request('ethereum://0x7a250d5630b4cf539739df2c5dacb4c659f2488d/balance')
    expect(value).toEqual(ethers.BigNumber.from('12345'))
  });
});
