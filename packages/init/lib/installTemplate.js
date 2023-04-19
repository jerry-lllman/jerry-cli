import path from 'node:path'

import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog } from '@jerrytestgroup/utils'
import ora from 'ora'
import { glob } from 'glob'
import ejs from 'ejs'

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

async function ejsRender(installDir) {
	try {
		const files = await glob('**', { cwd: installDir, nodir: true, ignore: ["**/node_modules/**"] })
		files.map(file => {
			const filePath = path.join(installDir, file)
			ejs.renderFile(filePath, {
				data: {
					name: 'react-template'
				}
			}).then(result => {
				fse.writeFileSync(filePath, result)
			}).catch(error => {
				printErrorLog()(error)
			})
		})
	} catch (error) {
		printErrorLog()(error)
	}

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

	ejsRender(installDir)
}