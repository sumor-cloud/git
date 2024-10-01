import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'

import repo from './assets/repo.js'
import fse from 'fs-extra'

import build from '../src/index.js'

const randomName = () => {
  const randomId = Math.random().toString(36).substring(7)
  return `build-${randomId}`
}

const checkVersion = async path => {
  const pkg = await fse.readJson(`${path}/package.json`)
  return pkg.version
}

describe('Build', () => {
  const root = `${process.cwd()}/tmp/${randomName()}`
  beforeAll(async () => {
    await fse.remove(root)
    await fse.ensureDir(root)
  })
  afterAll(async () => {
    await fse.remove(root)
  })
  it(
    'Build without actions',
    async () => {
      const buildInfo = await build({
        ...repo.version,
        target: 'v1.x'
      })
      const exists1 = await fse.exists(`${buildInfo.path}/LICENSE`)
      expect(exists1).toBeTruthy()
      const build1Version = await checkVersion(buildInfo.path)
      expect(build1Version).toBe('1.1.0')
      expect(buildInfo.commit).toBe('b1ece30cf278de4ff71ef2955d004b895848db8e')
      await fse.remove(buildInfo.path)
    },
    60 * 1000
  )
  it('Build with assets and action', async () => {
    const assets1 = `${root}/assets1`
    const assets2 = `${root}/assets2`
    await fse.ensureDir(assets1)
    await fse.ensureDir(assets2)

    await fse.writeJson(`${assets1}/demo1.json`, { name: 'demo1' })
    await fse.writeJson(`${assets2}/demo2.json`, { name: 'demo2' })

    const buildInfo = await build({
      ...repo.version,
      target: 'v2.x',
      assets: [assets1, assets2],
      build: async path => {
        const demo1 = await fse.readJson(`${path}/demo1.json`)
        const demo2 = await fse.readJson(`${path}/demo2.json`)
        await fse.writeJson(`${path}/demo.json`, {
          assets: [demo1.name, demo2.name]
        })
      }
    })
    const exists = await fse.exists(`${buildInfo.path}/LICENSE`)
    expect(exists).toBeTruthy()
    const buildVersion = await checkVersion(buildInfo.path)
    expect(buildVersion).toBe('2.0.0')
    expect(buildInfo.commit).toBe('5145ac7f2e331e644c5ae341596f33ec58d7c577')

    const buildResult = await fse.readJson(`${buildInfo.path}/demo.json`)
    expect(buildResult.assets).toEqual(['demo1', 'demo2'])
  })
})
