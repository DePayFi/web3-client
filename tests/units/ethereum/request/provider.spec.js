import { ethers } from 'ethers'
import { mock, resetMocks } from 'depay-web3-mock'
import { provider } from 'src/'

describe('request provider on ethereum', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)
  
  it('provides an RPC provider per default on ethereum', async ()=> {
    let selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)
  });

  it('provides a web3 wallet provider if wallet is connected on ethereum', async ()=> {
    mock('ethereum');
    let selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)
  });

  it('switches from RPC to web3 wallet in case wallet connects in the meantime on ethereum', async ()=> {
    let selectedProvider;
    
    global.ethereum = undefined // reset from previous test

    selectedProvider = await provider('ethereum');
    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('JsonRpcProvider')
    ).toEqual(true)

    mock('ethereum');
    selectedProvider = await provider('ethereum');

    expect(
      !!Object.getPrototypeOf(selectedProvider).constructor.toString().match('Web3Provider')
    ).toEqual(true)    
  })
});
