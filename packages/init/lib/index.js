import Command from '@jerrytestgroup/command'
import { log } from '@jerrytestgroup/utils'

import createTemplate from './createTemplate.js'
class InitCommand extends Command {
  get command() {
    return 'init [name]'
  }

  get description() {
    return 'init project'
  }

  get options() {
    return [
      ['-f, --force', '是否强制更新', false]
    ]
  }

  action([name, options]) {
    log.verbose('init', name, options)
    // 1. 选择项目模版，生成项目信息
    createTemplate(name, options)
    // 2. 下载项目模版至缓存目录
    // 3. 安装项目模版至项目目录

  }

  preAction() {
    console.log('pre')
  }

  postAction() {
    console.log('post')
  }
}


export default function Init(instance) {
  return new InitCommand(instance)
}