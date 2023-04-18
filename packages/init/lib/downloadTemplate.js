import path from 'node:path'

import ora from 'ora'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog } from '@jerrytestgroup/utils'

function getCacheDir(targetPath) {
	return  path.resolve(targetPath, 'node_modules')
}

function makeCacheDir(targetPath) {
	const cacheDir = getCacheDir(targetPath)
	if (!pathExistsSync(cacheDir)) {
		fse.mkdirpSync(cacheDir)
	}
}


export default function downloadTemplate(selectedTemplate) {
	const { targetPath, template } = selectedTemplate
	makeCacheDir(targetPath)
	const spinner = ora('正在下载模版...').start()
	try {
		setTimeout(() => {
			spinner.stop()
			log.success('模版下载成功！')
		}, 2000)
	} catch (error) {
		spinner.stop()
		printErrorLog()(error)
	}
}