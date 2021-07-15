export default (url) => {
  if (typeof url == 'object') {
    return url
  }
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<address>[\w\d]+)\/(?<method>[\w\d]+)/)
  return deconstructed.groups
}
