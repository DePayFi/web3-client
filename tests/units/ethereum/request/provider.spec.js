import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider, setProvider } from 'src/'

describe('request provider on ethereum', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('provides an StaticJsonRpcBatchProvider per default on ethereum', async ()=> {
    let selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('StaticJsonRpcBatchProvider')
    ).toEqual(true)
  });

  it('allows to set another provider', async ()=> {
    setProvider('ethereum', ['http://localhost:8545'])
    let selectedProvider = await provider('ethereum')
    expect(selectedProvider.connection.url).toEqual('http://localhost:8545')
  });
});
