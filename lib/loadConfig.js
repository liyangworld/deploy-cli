const path = require('path')
const fs = require('fs')

module.exports = function loadConfig (dir) {
  const configPath = path.resolve(dir, 'config.js')

  let configs = {}
  if (fs.existsSync(configPath)) {
    configs = require(configPath)
  } else {
    throw new Error(`配置文件 ${path.join(dir, 'config.js')} 缺失`)
  }
  return configs
}
