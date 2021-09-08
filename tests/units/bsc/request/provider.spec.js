import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider } from 'src/'

describe('request provider on bsc', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('provides an StaticJsonRpcBatchProvider per default on bsc', async ()=> {
    let selectedProvider = await provider('bsc');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('StaticJsonRpcBatchProvider')
    ).toEqual(true)
  });

  it('allows to set another provider', async ()=> {
    setProvider('bsc', ['http://localhost:8545'])
    let selectedProvider = await provider('bsc')
    expect(selectedProvider.connection.url).toEqual('http://localhost:8545')
  });
});
