import path from 'node:path'

import ora from 'ora'
import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog, installDependencies } from '@jerrytestgroup/utils'

function getCacheDir(targetPath) {
	return path.resolve(targetPath, 'node_modules')
}

// 创建缓存目录
function makeCacheDir(targetPath) {
	const cacheDir = getCacheDir(targetPath)
	if (!pathExistsSync(cacheDir)) {
		fse.mkdirpSync(cacheDir)
	}
}

// 判断是否需要下载模版
function shouldDownloadTemplate(templateDirPath, version) {
	const packageJsonPath = `${templateDirPath}/package.json`
	if (pathExistsSync(packageJsonPath)) {
		// 模版文件已经存在，读取 package.json 内容
		const packageJson = fse.readJsonSync(packageJsonPath)
		if (packageJson.version === version) {
			// 版本一致则不需要下载
			return false
		}
	}
	return true
}

async function downloadAddTemplate(targetPath, template) {
	const { npmName, version } = template

	const installArgs = `${npmName}@${version}`
	const cwd = getCacheDir(targetPath)
	log.verbose('installArgs', installArgs)
	log.verbose('cwd', cwd)
	// 先看看是否已经下载过，如果已经下载过就不重新下载
	// 将 cwd + npmName 就是下载的模版目录
	// 读取模版目录下的 package.json 文件中的 version，通过将两个 version 进行对比，如果 version 一致就说明可以不用下载
	const templateDirPath = `${cwd}/${npmName}`
	const needDownload = shouldDownloadTemplate(templateDirPath, version)
	if (needDownload) {
		await installDependencies(`${npmName}@${version}`, { cwd })
	}
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