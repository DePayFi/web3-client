import { request } from 'src/'
import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'

describe('request balance on ethereum', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('should request account balance on ethereum', async ()=> {

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

  it('allows to request account balance also with deconstructed URL on ethereum', async ()=> {

    mock({
      blockchain: 'ethereum',
      balance: {
        for: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
        return: '12345'
      }
    })
    
    let value = await request({ 
      blockchain: 'ethereum',
      address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
      method: 'balance'
    })
    expect(value).toEqual(ethers.BigNumber.from('12345'))
  });
});
