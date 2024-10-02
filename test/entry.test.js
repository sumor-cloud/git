import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'

import repo from './assets/repo.js'
import fse from 'fs-extra'

import entry from '../src/index.js'

const randomName = () => {
  const randomId = Math.random().toString(36).substring(7)
  return `entry-${randomId}`
}

const checkVersion = async path => {
  const pkg = await fse.readJson(`${path}/package.json`)
  return pkg.version
}

describe('Entry', () => {
  const root = `${process.cwd()}/tmp/${randomName()}`
  beforeAll(async () => {
    await fse.remove(root)
    await fse.ensureDir(root)
  })
  afterAll(async () => {
    await fse.remove(root)
  })
  it(
    'Common Usage',
    async () => {
      const path = `${root}/common`
      const repository = await entry(repo.version, path)
      const exists = await fse.exists(`${path}/LICENSE`)
      expect(exists).toBeTruthy()
      const buildVersion = await checkVersion(path)
      expect(buildVersion).toBe('2.0.0')

      const commit = await repository.currentCommit()
      expect(commit).toBe('feaacdb722c8d72fa8b4f0aa511bd0cce9f1ef89')
    },
    60 * 1000
  )
  it(
    'Checkout & Switch Branch',
    async () => {
      const path = `${root}/checkout`
      const repository = await entry(repo.version, path)
      const commit = await repository.currentCommit()
      expect(commit).toBe('feaacdb722c8d72fa8b4f0aa511bd0cce9f1ef89')

      await repository.checkout('v1.x')
      const commit2 = await repository.currentCommit()
      expect(commit2).toBe('b1ece30cf278de4ff71ef2955d004b895848db8e')

      await repository.checkout('v2.x')
      const commit3 = await repository.currentCommit()
      expect(commit3).toBe('5145ac7f2e331e644c5ae341596f33ec58d7c577')
    },
    60 * 1000
  )
  it(
    'Interact with Repository',
    async () => {
      const repoPath = `${root}/remote`
      await entry(null, repoPath)

      const path1 = `${root}/local1`
      await entry({ url: repoPath }, path1)
      const repository1 = await entry({ url: repoPath }, path1) // double init for unit test

      // init commit in local1
      await fse.writeFile(`${path1}/test.txt`, 'HELLO')
      await repository1.commitAll('hello')
      await repository1.push()

      const commit11 = await repository1.currentCommit()

      try {
        await repository1.github()
      } catch (e) {
        // do nothing
      }

      //
      const path2 = `${root}/local2`
      const repository2 = await entry({ url: repoPath }, path2)

      const commit21 = await repository2.currentCommit()

      try {
        await repository2.github()
      } catch (e) {
        // do nothing
      }

      expect(commit11).toBe(commit21)

      // commit changes in local1
      await fse.writeFile(`${path1}/test.txt`, 'HELLO_WORLD')
      await repository1.commitAll('hello world')
      await repository1.push()
      const commit12 = await repository1.currentCommit()

      await repository2.pull()
      const commit22 = await repository2.currentCommit()
      expect(commit12).toBe(commit22)
    },
    5 * 60 * 1000
  )
})
