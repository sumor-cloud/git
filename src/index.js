import clone from './clone/index.js'
import getTmpDir from './build/getTmpDir.js'
import fse from 'fs-extra'

export default async options => {
  const { url, token, username, password, target, assets, build } = options

  const config = {
    url,
    token,
    username,
    password
  }

  const path = getTmpDir()

  const commit = await clone(config, path, target)

  if (assets) {
    for (const asset of assets) {
      await fse.copy(asset, path)
    }
  }

  if (build) {
    await build(path)
  }

  return {
    commit,
    path
  }
}
