import { getWindow } from './window'

const getConfiguration = () =>{
  if(getWindow()._Web3ClientConfiguration === undefined) {
    getWindow()._Web3ClientConfiguration = {}
  }
  return getWindow()._Web3ClientConfiguration
}

const setConfiguration = (configuration) =>{
  getWindow()._Web3ClientConfiguration = !!configuration ? configuration : {}
  return getWindow()._Web3ClientConfiguration
}

export { 
  setConfiguration,
  getConfiguration,
}
