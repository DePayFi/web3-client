import ethers from 'ethers';

let account, provider;

export default async function(){
  let newAccount;

  if(window?.ethereum){
    let accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if(accounts instanceof Array) {
      newAccount = accounts[0];
    }
  }

  if(provider && newAccount === account) { return provider }
  account = newAccount;

  if(account) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.JsonRpcProvider(['https://mainnet.infu','ra.io/v3/9aa3d95b3bc440fa8','8ea12eaa4456161'].join(''));
  }

  return provider
}
