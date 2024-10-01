import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'

import repo from './assets/repo.js'
import fse from 'fs-extra'

import stringifyUrl from '../src/clone/stringifyUrl.js'
import clone from '../src/clone/index.js'

const randomName = () => {
  const randomId = Math.random().toString(36).substring(7)
  return `clone-${randomId}`
}

const checkVersion = async path => {
  const pkg = await fse.readJson(`${path}/package.json`)
  return pkg.version
}

describe('Clone', () => {
  const root = `${process.cwd()}/tmp/${randomName()}`
  beforeAll(async () => {
    await fse.remove(root)
    await fse.ensureDir(root)
  })
  afterAll(async () => {
    await fse.remove(root)
  })
  it('Stringify URL', async () => {
    const info1 = {
      url: 'https://github.com/sumor-cloud/priate-app.git',
      user: 'sumor',
      password: 'password'
    }
    const result1 = stringifyUrl(info1)
    expect(result1).toBe('https://sumor:password@github.com/sumor-cloud/priate-app.git')

    const info2 = {
      url: 'https://github.com/sumor-cloud/priate-app.git',
      user: 'sumor',
      password: 'password',
      token: 'demo-token' // token should be considered first
    }
    const result2 = stringifyUrl(info2)
    expect(result2).toBe('https://demo-token@github.com/sumor-cloud/priate-app.git')

    const info3 = {
      url: 'git@github.com:sumor-cloud/priate-app.git'
    }
    try {
      stringifyUrl(info3)
      expect(false).toBeTruthy() // should not reach here
    } catch (e) {
      expect(e).toBeDefined()
    }

    const info4 = {
      url: 'https://github.com/sumor-cloud/priate-app.git'
    }
    const result4 = stringifyUrl(info4)
    expect(result4).toBe('https://github.com/sumor-cloud/priate-app.git')
  })

  it(
    'Clone without target',
    async () => {
      // clone for public repo
      const path1 = `${root}/clone1`
      await clone(repo.version, path1)
      const exists1 = await fse.exists(`${path1}/LICENSE`)
      expect(exists1).toBeTruthy()
      const clone1Version = await checkVersion(path1)
      expect(clone1Version).toBe('2.0.0')

      // clone for private repo with token
      const path2 = `${root}/clone2`
      await clone(repo.private, path2)
      const exists2 = await fse.exists(`${path2}/LICENSE`)
      expect(exists2).toBeTruthy()
    },
    60 * 1000
  )

  it(
    'Clone with target',
    async () => {
      // checkout tag v1.0.0
      const path1 = `${root}/cloneTarget1`
      await clone(repo.version, path1, 'v1.0.0')
      const exists1 = await fse.exists(`${path1}/LICENSE`)
      expect(exists1).toBeTruthy()
      const clone1Version = await checkVersion(path1)
      expect(clone1Version).toBe('1.0.0')

      // checkout commit c5af4ce
      const path2 = `${root}/cloneTarget2`
      await clone(repo.version, path2, 'c5af4ce')
      const exists2 = await fse.exists(`${path2}/LICENSE`)
      expect(exists2).toBeTruthy()
      const clone2Version = await checkVersion(path2)
      expect(clone2Version).toBe('1.0.2')

      // checkout branch v1.x
      const path3 = `${root}/cloneTarget3`
      const commit3 = await clone(repo.version, path3, 'v1.x')
      const exists3 = await fse.exists(`${path3}/LICENSE`)
      expect(exists3).toBeTruthy()
      const clone3Version = await checkVersion(path3)
      expect(clone3Version).toBe('1.1.0')
      expect(commit3).toBe('b1ece30cf278de4ff71ef2955d004b895848db8e')

      // checkout branch v2.x
      const path4 = `${root}/cloneTarget4`
      const commit4 = await clone(repo.version, path4, 'v2.x')
      const exists4 = await fse.exists(`${path4}/LICENSE`)
      expect(exists4).toBeTruthy()
      const clone4Version = await checkVersion(path4)
      expect(clone4Version).toBe('2.0.0')
      expect(commit4).toBe('5145ac7f2e331e644c5ae341596f33ec58d7c577')
    },
    60 * 1000
  )

  it('Clone with existing folder', async () => {
    const path = `${root}/cloneExisting`
    await fse.ensureDir(path)
    try {
      await clone(repo.version, path)
      expect(false).toBeTruthy() // should not reach here
    } catch (e) {
      expect(e).toBeDefined()
    }
  })
})
