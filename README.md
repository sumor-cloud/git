# git

A [Sumor Cloud](https://sumor.cloud) Tool.  
[More Documentation](https://sumor.cloud/git)

A git version library, easily packaging version and generate specific package with env.

[![NPM Version](https://img.shields.io/npm/v/@sumor/git?logo=npm&label=NPM)](https://www.npmjs.com/package/@sumor/git)
[![NPM Downloads](https://img.shields.io/npm/dw/@sumor/git?logo=npm&label=Downloads)](https://www.npmjs.com/package/@sumor/git)
[![GitHub CI](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git/ci.yml?logo=github&label=CI)](https://github.com/sumor-cloud/git/actions/workflows/ci.yml)
[![GitHub Test](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git/ut.yml?logo=github&label=Test)](https://github.com/sumor-cloud/git/actions/workflows/ut.yml)
[![GitHub Coverage](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git/coverage.yml?logo=github&label=Coverage)](https://github.com/sumor-cloud/git/actions/workflows/coverage.yml)
[![GitHub Audit](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git/audit.yml?logo=github&label=Audit)](https://github.com/sumor-cloud/git/actions/workflows/audit.yml)

## Installation

```bash
npm i @sumor/git --save
```

## Prerequisites

### Node.JS version

Require Node.JS version 18.x or above

### require Node.JS ES module

As this package is written in ES module,
please change the following code in your `package.json` file:

```json
{
  "type": "module"
}
```

## Usage

```javascript
import git from '@sumor/git'
const config = {
  // git url and credentials
  url: '<git url>', // mandatory
  token: '<git token>', // mandatory, if username and password are not provided
  username: '<git username>', // mandatory, if token is not provided
  password: '<git password>' // mandatory, if token is not provided
}
const repository = await git(config, path)

const commit1 = await repository.currentCommit() // get current commit

const commit2 = await repository.checkout('<target commit>') // can be a branch or a tag or a commit

// if you installed Github Desktop, you can use below command to open it in Github Desktop
await repository.github()
```

## Create new local repository

When you pass null as config, it will create a new repository in local path.

```javascript
await git(null, path1)

// usage for local repository
const repository = await git({ url: path1 }, path2)
```
