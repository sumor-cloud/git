import cmd from './clone/cmd.js'

export default class Repository {
  constructor(path) {
    this.path = path
  }

  async cmd(command) {
    return await cmd(command, { cwd: this.path, stdio: 'inherit' })
  }

  async github() {
    return await this.cmd('github .')
  }

  async currentCommit() {
    const commitHash = await this.cmd('git rev-parse HEAD')
    return commitHash.replace('\n', '')
  }

  async checkout(target) {
    await this.cmd(`git checkout ${target}`)
  }

  async pull() {
    await this.cmd(`git pull`)
  }

  async commit(message) {
    await this.cmd(`git commit -m "${message}"`)
  }

  async commitAll(message) {
    await this.cmd(`git add .`)
    await this.commit(message)
  }

  async push() {
    await this.cmd(`git push`)
  }
}
