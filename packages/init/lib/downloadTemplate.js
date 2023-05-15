import path from 'node:path'

import ora from 'ora'
import {execa} from 'execa'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog, installDependencies } from '@jerrytestgroup/utils'

function getCacheDir(targetPath) {
	return path.resolve(targetPath, 'node_modules')
}

function makeCacheDir(targetPath) {
	const cacheDir = getCacheDir(targetPath)
	if (!pathExistsSync(cacheDir)) {
		fse.mkdirpSync(cacheDir)
	}
}

async function downloadAddTemplate(targetPath, template) {
	const { npmName, version } = template

	const installArgs = `${npmName}@${version}`
	const cwd = getCacheDir(targetPath)
	log.verbose('installArgs', installArgs)
	log.verbose('cwd', cwd)
	// 先看看是否已经下载过，如果已经下载过就直接 return
	
	await installDependencies(`${npmName}@${version}`, { cwd })
}

export default async function downloadTemplate(selectedTemplate) {
	const { targetPath, template } = selectedTemplate
	makeCacheDir(targetPath)
	const spinner = ora('正在下载模版...').start()
	try {
		await downloadAddTemplate(targetPath, template)
		spinner.succeed('模版下载成功！')
	} catch (error) {
		spinner.fail('模版下载失败！')
		printErrorLog()(error)
	}
}