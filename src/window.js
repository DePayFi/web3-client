let getWindow = () => {
  if (typeof global == 'object') return global
  return window
}

export {
  getWindow
}
