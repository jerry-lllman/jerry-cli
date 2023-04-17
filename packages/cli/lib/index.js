import createInitCommand from '@jerrytestgroup/init'
import createCLI from './createCLI.js'
import './exception.js'

export default function () {
	// program
	// 	.name(Object.keys(pkg.bin)[0])
	// 	.usage('<command> [options]')
	// 	.version(pkg.version)
	// 	.option('-d, --debug', '是否开启调试模式', false)
	// 	.hook('preAction', preAction)
	const program = createCLI()

	// program
	// 	.command('init [name]')
	// 	.description('init project')
	// 	.option('-f, --force', '是否强制更新', false)
	// 	.action(() => {
	// 		console.log('init...')
	// 	})
	createInitCommand(program)

	program.parse(process.argv)
}