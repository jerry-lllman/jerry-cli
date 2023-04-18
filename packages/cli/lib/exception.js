import { printErrorLog } from "@jerrytestgroup/utils"

process.on('uncaughtException', printErrorLog('error'))

process.on('unhandledRejection', printErrorLog('promise'))