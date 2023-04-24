
import log from './log.js'
import isDebug from './isDebug.js'
export * from './inquirer.js'
export * from './npm.js'
export * from './execa.js'

export function printErrorLog(type) {
	return (e) => {
		if (isDebug()) {
			log.error(type, e)
		} else {
			log.error(type, e.message)
		}
	}
}


export {
  log,
  isDebug,
  // makeList,
  // makeInput
}

