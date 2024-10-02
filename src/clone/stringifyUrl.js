export default ({ url, user, username, password, token }) => {
  username = username || user

  const urlArr = url.split('/')

  if (url.indexOf('http') === 0) {
    const protocol = urlArr.shift()
    urlArr.shift() // remove empty string
    const suffixUrl = urlArr.join('/')
    if (token) {
      return `${protocol}//${token}@${suffixUrl}`
    } else if (username && password) {
      return `${protocol}//${username}:${password}@${suffixUrl}`
    } else {
      return url
    }
  } else {
    return url
  }
}
