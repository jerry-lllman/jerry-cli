#!/usr/bin/env node

import importLocal from 'import-local'
import { filename } from 'dirname-filename-esm'
import { log } from '@jerrytestgroup/utils'

import entry from '../lib/index.js'

// import { fileURLToPath } from 'node:url'
// const __filename = fileURLToPath(import.meta.url)
const __filename = filename(import.meta)

if (importLocal(__filename)) {
  log.info('cli', '使用本地 jerry-cli 版本')
} else {
  entry(process.argv.slice(2))
}