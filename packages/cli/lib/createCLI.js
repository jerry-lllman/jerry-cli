import path from 'node:path'

import { dirname } from 'dirname-filename-esm'
import fse from 'fs-extra'
import semver from 'semver'
import chalk from 'chalk'
import { program } from 'commander'

import { log } from "@jerrytestgroup/utils"

const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname, '../package.json')
const pkg = fse.readJsonSync(pkgPath)


const LOWEST_NODE_VERSION = '14.0.0'

function checkNodeVersion() {
	log.verbose('node version: ', process.version)
	if (!semver.gte(process.version, LOWEST_NODE_VERSION)) {
		throw new Error(chalk.red(`jerry-cli 需要安装${LOWEST_NODE_VERSION}及以上版本的Node.js`))
	}
}

function preAction() {
	checkNodeVersion()
}

export default function createCLI() {
	log.info('version', pkg.version)
	program
		.name(Object.keys(pkg.bin)[0])
		.usage('<command> [options]')
		.version(pkg.version)
		.option('-d, --debug', '是否开启调试模式', false)
		.hook('preAction', preAction)

	return program
}
