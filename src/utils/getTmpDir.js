import os from 'os'
import fse from 'fs-extra'

export default async () => {
  const path = `${os.tmpdir()}/sumor-git/${Date.now()}`
  await fse.ensureDir(path)
  return path
}
