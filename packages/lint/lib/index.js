import ora from 'ora'
import { execa } from 'execa'
import { ESLint } from 'eslint'

import Command from '@jerrytestgroup/command'
import { log, printErrorLog, installDevDependencies, getRunScriptType, setRunCommandType, isDebug } from '@jerrytestgroup/utils'

import reactConfig from './eslint/reactConfig.js'

class LintCommand extends Command {
  get command() {
    return 'lint'
  }

  get description() {
    return 'lint project'
  }

  get options() {
    return []
  }

  async action() {
    log.verbose('lint')
    setRunCommandType(await getRunScriptType())
    const spinner = ora('正在安装依赖...').start()
    try {
      // 安装 eslint 相关依赖
      const packages = ['eslint', 'eslint-plugin-react', 'eslint-plugin-react-hooks', '@typescript-eslint/parser',  '@typescript-eslint/eslint-plugin', '@antfu/eslint-config-react']

      await installDevDependencies(packages, isDebug() && { stdout: 'inherit' })
    } catch (error) {
      printErrorLog(error)
    } finally {
      spinner.stop()
    }
    const cwd = process.cwd()
    const eslint = new ESLint({
      cwd,
      // baseConfig: reactConfig // 作为基础的 eslint 配置
      overrideConfig: reactConfig // 以这个 config 为准
    })
    const results = await eslint.lintFiles(['src/**/*.{js,jsx,ts,tsx}'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    console.log(resultText)
  }
}


export default function Lint(instance) {
  return new LintCommand(instance)
}