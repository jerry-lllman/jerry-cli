import createInitCommand from '@jerrytestgroup/init'
import createLintCommand from '@jerrytestgroup/lint'
import createCLI from './createCLI.js'
import './exception.js'

export default function () {
	const program = createCLI()
	createInitCommand(program)
	createLintCommand(program)

	program.parse(process.argv)
}