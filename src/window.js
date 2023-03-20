let _window

let getWindow = () => {
  if(_window) { return _window }
  if (typeof global == 'object') {
    _window = global
  } else {
    _window = window
  }
  return _window
}

export {
  getWindow
}
