import path from 'node:path'

import ora from 'ora'
import {execa} from 'execa'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog } from '@jerrytestgroup/utils'

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

	const installCommand = 'npm'
	const installArgs = ['install', `${npmName}@${version}`]
	const cwd = getCacheDir(targetPath)
	log.verbose('installArgs', installArgs)
	log.verbose('cwd', cwd)

	await execa(installCommand, installArgs, { cwd })
}

export default async function downloadTemplate(selectedTemplate) {
	const { targetPath, template } = selectedTemplate
	makeCacheDir(targetPath)
	const spinner = ora('正在下载模版...').start()
	try {
		await downloadAddTemplate(targetPath, template)
		spinner.stop()
		log.success('模版下载成功！')
	} catch (error) {
		spinner.stop()
		printErrorLog()(error)
	}
}