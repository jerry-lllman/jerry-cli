import { isDebug, log } from "@jerrytestgroup/utils"

function printErrorLog(type) {
	return (e) => {
		if (isDebug()) {
			log.error(type, e)
		} else {
			log.error(type, e.message)
		}
	}
}

process.on('uncaughtException', printErrorLog('error'))

process.on('unhandledRejection', printErrorLog('promise'))