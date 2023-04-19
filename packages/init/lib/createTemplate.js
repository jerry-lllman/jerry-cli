import path from 'node:path'
import { homedir } from 'node:os'
import { getLatestVersion, log, makeInput, makeList } from "@jerrytestgroup/utils"

const ADD_TYPE_PROJECT = 'project'
const ADD_TYPE_PAGE = 'page'

const ADD_TEMPLATES = [
	{
		name: 'react 项目模版',
		value: 'template-react',
		npmName: '@jerry.com/template-react',
		version: '1.0.0'
	},
	{
		name: 'vue 项目模版',
		value: 'template-vue',
		npmName: '@jerry.com/template-vue',
		version: '1.0.0'
	}
]

const ADD_TYPES = [
	{
		name: '项目',
		value: ADD_TYPE_PROJECT
	},
	{
		name: '页面',
		value: ADD_TYPE_PAGE
	}
]

const TEMP_HOME = '.cli-jerry'

function getAddType() {
	return makeList({
		choices: ADD_TYPES,
		message: '请选择初始化类型',
		defaultValue: ADD_TYPE_PROJECT
	})
}

function getAddName() {
	return makeInput({
		message: '请输入项目名称',
		defaultValue: '',
		require: true,
		validate(value) {
			if (value.length) {
				return true
			} else {
				return '请输入项目名称'
			}
		}
	})
}


function getAddTemplate() {
	return makeList({
		choices: ADD_TEMPLATES,
		message: '请选择项目模版'
	})
}


function makeTargetPath() {
	return path.resolve(`${homedir()}/${TEMP_HOME}`, 'addTemplate')
}

export default async function createTemplate(name, options) {

	const { type, template } = options

	let addType // 创建项目类型
	let addName // 创建项目名称
	let selectedTemplate // 创建项目模版
	if (type) {
		addType = type
	} else {
		// 获取创建的类型
		addType = await getAddType()
	}

	log.verbose('addType', addType)

	if (addType === ADD_TYPE_PROJECT) {
		if (name) {
			addName = name
		} else {
			addName = await getAddName()
		}
		log.verbose('addName', addName)

		if (template) {
			selectedTemplate = ADD_TEMPLATES.find(tp => tp.value === template)
			if (!selectedTemplate) {
				throw new Error(`项目模版 ${template} 不存在`)
			}
		} else {
			const addTemplate = await getAddTemplate()
			log.verbose('addTemplate', addTemplate)
			selectedTemplate = ADD_TEMPLATES.find(template => template.value === addTemplate)
		}

		log.verbose('selectedTemplate', selectedTemplate)


		// 获取最新版本号
		const latestVersion = await getLatestVersion(selectedTemplate.npmName)
		log.verbose('latestVersion', latestVersion)
		selectedTemplate.version = latestVersion

		const targetPath = makeTargetPath()

		// TODO: 获取使用何种方式进行 npm yarn pnpm

		return {
			type: addType,
			name: addName,
			template: selectedTemplate,
			targetPath
		}
	} else {
		throw new Error(`类型 ${addType} 不支持`)
	}

}