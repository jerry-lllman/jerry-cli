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
		require: true
	})
}


function getAddTemplate() {
	return makeList({
		choices: ADD_TEMPLATES,
		message: '请选择项目模版'
	})
}

export default async function createTemplate(name, options) {
	// 获取创建的类型
	const addType = await getAddType()
	log.verbose('addType', addType)

	if (addType === ADD_TYPE_PROJECT) {
		const addName = await getAddName()
		log.verbose('addType', addName)

		const addTemplate = await getAddTemplate()
		log.verbose('addType', addTemplate)

		const selectedTemplate = ADD_TEMPLATES.find(template => template.value === addTemplate)
		log.verbose('selectedTemplate', selectedTemplate)

		// 获取最新版本号
		const latestVersion = await getLatestVersion(selectedTemplate.npmName)
		log.verbose('latestVersion', latestVersion)
		selectedTemplate.version = latestVersion
		
		return {
			type: addType,
			name: addName,
			template: selectedTemplate
		}
	}


}