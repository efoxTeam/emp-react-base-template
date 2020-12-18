const path = require('path')
const packagePath = path.join(path.resolve('./'), 'package.json')
const {dependencies} = require(packagePath)
console.log(packagePath)
const empConfig = require(`${resolveApp('')}/emp.json`);
module.exports = ({config, env}) => {
  const port = 8001
  const projectName = 'empReactBase'
  const publicPath = `http://localhost:${port}/`
  // 设置项目URL
  config.output.publicPath(publicPath)
  // 设置项目端口
  config.devServer.port(port)
  const remoteEntry = 'http://localhost:8002/emp.js'
  config.plugin('mf').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        ...empConfig,
        // 暴露项目的全局变量名
        library: {type: 'var', name: empConfig.name},
        // 被远程引入的文件名
        filename: 'emp.js',
      },
    }
    return args
  })
  // 配置 index.html
  config.plugin('html').tap(args => {
    args[0] = {
      ...args[0],
      ...{
        // head 的 title
        title: 'EMP-Base-Project',
        // 远程调用项目的文件链接
        files: {
          js: [remoteEntry],
        },
      },
    }
    return args
  })
}
