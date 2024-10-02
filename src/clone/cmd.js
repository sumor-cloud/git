import { exec } from 'child_process'
import logger from '../logger.js'

export default (execString, options) =>
  new Promise((resolve, reject) => {
    logger.debug(`${options.cwd}> ${execString}`)
    const childProcess = exec(execString, options)
    let result = ''
    let err = ''
    const formatData = data => {
      data = data.toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      return data
    }
    childProcess.stdout.on('data', async data => {
      result += formatData(data)
      // process.stdout.write(data)
    })
    childProcess.stderr.on('data', async data => {
      err += formatData(data)
      // process.stderr.write(data)
    })
    childProcess.on('close', async code => {
      if (code !== 0) {
        logger.error(result)
        reject(err)
      } else {
        logger.trace(result)
        resolve(result)
      }
    })
  })
