import path from 'node:path'

import fse from 'fs-extra'
import { pathExistsSync } from 'path-exists'
import { log, printErrorLog, makeList, makeInput } from '@jerrytestgroup/utils'
import ora from 'ora'
import { glob } from 'glob'
import ejs from 'ejs'

function getCacheFilePath(targetPath, template) {
	return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}

function getPluginFilePath(targetPath, template) {
	return path.resolve(targetPath, 'node_modules', template.npmName, 'plugins', 'index.js')
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

async function ejsRender(targetPath, installDir, name, template) {
	log.verbose('ejsRender', installDir, template)
	const { ignore } = template

	// 执行插件
	let data = {}
	const pluginPath = getPluginFilePath(targetPath, template)
	if (pathExistsSync(pluginPath)) {
		const pluginFn = (await import(pluginPath)).default
		const api = {
			makeInput,
			makeList
		}
		data = await pluginFn(api)
	}

	const ejsData = {
		data: {
			name,
			...data
		}
	}
	try {
		// 通过 glob 匹配规则获取文件
		const files = await glob('**', {
			cwd: installDir,
			nodir: true,
			ignore: ignore
		})

		files.forEach(file => {
			const filePath = path.join(installDir, file)
			ejs.renderFile(filePath, ejsData).then(result => {
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

	// ensureDirSync 保证路径存在，如果不存在，fse.ensureDirSync 会创建
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

	await ejsRender(targetPath, installDir, name, template)
}