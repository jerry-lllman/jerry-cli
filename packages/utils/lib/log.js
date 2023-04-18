import log from 'npmlog'
import isDebug from './isDebug.js'

if (isDebug()) {
	log.level = 'verbose'
} else {
	log.level = 'info'
}

log.addLevel('success', 2000, { fg: 'green' })

export default log