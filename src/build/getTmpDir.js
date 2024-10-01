import os from 'os'

export default () => {
  const randomId = Math.random().toString(36).substring(7)
  return `${os.tmpdir()}/sumor-git/repo-${Date.now()}-${randomId}`
}
