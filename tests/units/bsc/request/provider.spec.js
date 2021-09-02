import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider } from 'src/'

describe('request provider on bsc', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('provides an JsonRpcBatchProvider per default on bsc', async ()=> {
    let selectedProvider = await provider('bsc');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcBatchProvider')
    ).toEqual(true)
  });

});
