/* eslint-disable @typescript-eslint/no-unused-vars */
import { basename } from 'path'

export default {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(basename(sourcePath))};`
    }
  }
}
