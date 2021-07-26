import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider } from 'src/'

describe('request provider on bsc', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('provides an RPC provider per default on bsc', async ()=> {
    let selectedProvider = await provider('bsc');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)
  });

  it('provides a web3 wallet provider if wallet is connected on bsc', async ()=> {
    mock('bsc');
    let selectedProvider = await provider('bsc');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)
  });

  it('switches from RPC to web3 wallet in case wallet connects in the meantime on bsc', async ()=> {
    let selectedProvider;
    
    global.ethereum = undefined // reset from previous test

    selectedProvider = await provider('bsc');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)

    mock('bsc');
    selectedProvider = await provider('bsc');

    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)    
  })
});
