import Command from '@jerrytestgroup/command'
import { log } from '@jerrytestgroup/utils'

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

  action([name, opts]) {
    log.verbose('init', name, opts)
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