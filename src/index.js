import clone from './clone/index.js'
import Repository from './Repository.js'
import fse from 'fs-extra'
import cmd from './clone/cmd.js'

export default async (config, path) => {
  if (config) {
    // clone from remote
    if (!(await fse.exists(path))) {
      await clone(config, path)
    }

    return new Repository(path)
  } else {
    // create new repository
    await fse.ensureDir(path)
    await cmd(`git init --bare`, { cwd: path })
  }
}
