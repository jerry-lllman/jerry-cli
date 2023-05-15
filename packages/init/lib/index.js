import Command from '@jerrytestgroup/command'
import { log, setRunCommandType } from '@jerrytestgroup/utils'

import createTemplate from './createTemplate.js'
import downloadTemplate from './downloadTemplate.js'
import installTemplate from './installTemplate.js'

class InitCommand extends Command {
  get command() {
    return 'init [name]'
  }

  get description() {
    return 'init project'
  }

  get options() {
    return [
      ['-f, --force', '是否强制更新', false],
      ['-t, --type <type>', '项目类型(project/page)'],
      ['-tp, --template <template>', '项目模版(template-react/template-vue)'],
    ]
  }

  async action([name, options]) {
    log.verbose('init', name, options)
    // 1. 选择项目模版，生成项目信息
    const selectedTemplate = await createTemplate(name, options)
    const runCommandType = selectedTemplate.runCommandType
    setRunCommandType(runCommandType)
    log.verbose('template', selectedTemplate)
    // 2. 下载项目模版至缓存目录
    await downloadTemplate(selectedTemplate)
    // 3. 安装项目模版至项目目录
    await installTemplate(selectedTemplate, options)
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