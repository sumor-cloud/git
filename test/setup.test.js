import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'

import repo from './assets/repo.js'
import fse from 'fs-extra'

import clone from '../src/setup/index.js'
import stringifyUrl from '../src/setup/stringifyUrl.js'
import getCurrentBranch from '../src/git/getCurrentBranch.js'
import getTmpDir from './test-utils/getTmpDir.js'

describe('Git Tools', () => {
  const root = getTmpDir('pack-setup')
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
    'Clone',
    async () => {
      const path1 = `${root}/clone1`
      await clone(repo.version, path1)
      const exists1 = await fse.exists(`${path1}/LICENSE`)
      expect(exists1).toBeTruthy()

      const path2 = `${root}/clone2`
      await clone(repo.private, path2)
      const exists2 = await fse.exists(`${path2}/LICENSE`)
      expect(exists2).toBeTruthy()
    },
    60 * 1000
  )
  it(
    'Fetch',
    async () => {
      const path1 = `${root}/clone1`
      await clone(repo.version, path1)
      const exists1 = await fse.exists(`${path1}/LICENSE`)
      expect(exists1).toBeTruthy()
    },
    60 * 1000
  )
  it(
    'Checkout',
    async () => {
      const path1 = `${root}/clone1`
      const currentBranch = await getCurrentBranch(path1)
      expect(currentBranch).toBe('main')
      await clone(repo.version, path1, 'v1.x')
      const newBranch = await getCurrentBranch(path1)
      expect(newBranch).toBe('v1.x')
    },
    60 * 1000
  )
})
