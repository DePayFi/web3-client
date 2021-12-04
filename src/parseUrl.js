export default (url) => {
  if (typeof url == 'object') {
    return url
  }
  let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<part1>[\w\d]+)(\/(?<part2>[\w\d]+))?/)

  if(deconstructed.groups.part2 == undefined) {
    return {
      blockchain: deconstructed.groups.blockchain,
      method: deconstructed.groups.part1
    }
  } else {
    return {
      blockchain: deconstructed.groups.blockchain,
      address: deconstructed.groups.part1,
      method: deconstructed.groups.part2
    }
  }
}
