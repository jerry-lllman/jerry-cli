import path from 'node:path'

import ora from 'ora'
import fse from 'fs-extra'
import { ESLint } from 'eslint'

import Command from '@jerrytestgroup/command'
import { log, printErrorLog, installDevDependencies, getRunScriptType, setRunCommandType, isDebug } from '@jerrytestgroup/utils'

import reactConfig from './eslint/reactConfig.js'
import vueConfig from './eslint/vueConfig.js'

function getProjectFormwork() {
  // 读取运行命令的目录，找到packages.json文件 并读取里面的内容
  const cwd = process.cwd()
  const packagesJsonPath = path.resolve(`${cwd}/package.json`)
  const pkg = fse.readJsonSync(packagesJsonPath)
  if (pkg.dependencies.react) {
    return 'react'
  } else if (pkg.dependencies.vue) {
    return 'vue'
  }
}

const formworkESLintDependents = {
  vue: [],
  react: ['eslint', 'eslint-plugin-react', 'eslint-plugin-react-hooks', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', '@antfu/eslint-config-react']
}

function getESLintDependents(formworkType) {
  return formworkESLintDependents[formworkType]
}

function getInternalESLintConfig(formworkType) {
  if (formworkType === 'react') {
    return reactConfig
  } else if (formworkType === 'vue') {
    return vueConfig
  }
}

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
    const formwork = getProjectFormwork()
    const ESLintDependents = getESLintDependents(formwork)
    // TODO: 检查 package.json 里面安装了对应的依赖没有，如果没有则提醒需要安装哪些依赖，并选择安装方式

    setRunCommandType(await getRunScriptType())
    const spinner = ora('正在安装依赖...').start()
    try {
      // 安装 eslint 相关依赖
      await installDevDependencies(ESLintDependents, isDebug() && { stdout: 'inherit' })
    } catch (error) {
      printErrorLog(error)
    } finally {
      spinner.stop()
    }
    const cwd = process.cwd()
    const internalESLintConfig = getInternalESLintConfig(formwork)

    // TODO: 支持通过读取目录下的 eslint config 文件来合并覆盖配置

    const eslint = new ESLint({
      cwd,
      // baseConfig: internalESLintConfig // 作为基础的 eslint 配置
      overrideConfig: internalESLintConfig
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