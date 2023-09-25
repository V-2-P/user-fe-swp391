/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path'

module.exports = {
  process(_src: any, filename: string, _config: any, _options: any) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
  }
}
