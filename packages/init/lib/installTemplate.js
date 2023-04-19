import path from 'node:path'

import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log } from '@jerrytestgroup/utils'
import ora from 'ora'


function getCacheFilePath(targetPath, template) {
	return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function copyFile(targetPath, template, installDir) {
	const originDir = getCacheFilePath(targetPath, template)
	const fileList = fse.readdirSync(originDir)
	const spinner = ora('正在拷贝模版文件...').start()
	fileList.map(file => {
		fse.copySync(`${originDir}/${file}`, `${installDir}/${file}`)
	})
	spinner.succeed('模版拷贝成功')
}

export default async function installTemplate(selectedTemplate, options) {
	const { force = false } = options
	const { targetPath, name, template } = selectedTemplate
	const rootDir = process.cwd()

	// ensureDirSync 保证路径存在
	fse.ensureDirSync(targetPath)
	const installDir = path.resolve(`${rootDir}/${name}`)

	if (pathExistsSync(installDir)) {
		if (!force) {
			log.error(`当前目录下已经在 ${installDir} 文件夹`)
			return
		}
		fse.removeSync(installDir)
		fse.ensureDirSync(installDir)
	} else {
		fse.ensureDirSync(installDir)
	}
	copyFile(targetPath, template, installDir)
}