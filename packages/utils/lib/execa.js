import { execa } from 'execa'
import log from './log.js'
import { makeList } from './inquirer.js'

const ADD_SCRIPT_TYPES = [
	{
		name: 'npm',
		value: 'npm'
	},
	{
		name: 'yarn',
		value: 'yarn'
	},
	{
		name: 'pnpm',
		value: 'pnpm'
	},
]


export function getRunScriptType(message = '请选择运行脚本方式') {
	return makeList({
		choices: ADD_SCRIPT_TYPES,
		message,
	})
}


let runCommandType = 'npm'

function installPackages(installType) {
	return async (packages, options) => {
		if (typeof packages === 'string') {
			packages = [packages]
		}

		log.verbose('runCommandType', runCommandType)
		await execa(runCommandType, ['install', installType, ...packages], options)
	}
}

export function setRunCommandType(type) {
	log.verbose('setRunCommandType', type)
	runCommandType = type
}

export const installDevDependencies = installPackages('--save-dev')

export const installDependencies = installPackages('--save')


