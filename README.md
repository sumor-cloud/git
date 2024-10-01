# git-builder

A [Sumor Cloud](https://sumor.cloud) Tool.  
[More Documentation](https://sumor.cloud/git-builder)

A git version library, easily packaging version and generate specific package with env.

[![NPM Version](https://img.shields.io/npm/v/@sumor/git-builder?logo=npm&label=NPM)](https://www.npmjs.com/package/@sumor/git-builder)
[![NPM Downloads](https://img.shields.io/npm/dw/@sumor/git-builder?logo=npm&label=Downloads)](https://www.npmjs.com/package/@sumor/git-builder)
[![GitHub CI](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git-builder/ci.yml?logo=github&label=CI)](https://github.com/sumor-cloud/git-builder/actions/workflows/ci.yml)
[![GitHub Test](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git-builder/ut.yml?logo=github&label=Test)](https://github.com/sumor-cloud/git-builder/actions/workflows/ut.yml)
[![GitHub Coverage](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git-builder/coverage.yml?logo=github&label=Coverage)](https://github.com/sumor-cloud/git-builder/actions/workflows/coverage.yml)
[![GitHub Audit](https://img.shields.io/github/actions/workflow/status/sumor-cloud/git-builder/audit.yml?logo=github&label=Audit)](https://github.com/sumor-cloud/git-builder/actions/workflows/audit.yml)

## Installation

```bash
npm i @sumor/git-builder --save
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
import gitBuilder from '@sumor/git-builder'

const result = await gitBuilder({
  // git url and credentials
  url: '<git url>', // mandatory
  token: '<git token>', // mandatory, if username and password are not provided
  username: '<git username>', // mandatory, if token is not provided
  password: '<git password>', // mandatory, if token is not provided

  // target commit
  target: '<target commit>', // mandatory, can be a branch or a tag or a commit

  // post actions
  assets: [
    // optional, it will be copied to the git project root path
    '<asset 1 path>',
    '<asset 2 path>'
  ],
  build: async env => {
    // optional
    // env is the git project root path
    // you can do anything you want before packaging
  }
})

console.log(result)
/*
{
    commit: '<commit id>',
    path: '<output zip path>'
} 
*/
```
