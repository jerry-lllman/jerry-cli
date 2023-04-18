import axios from 'axios'

function getNpmInfo(npmName) {
	const register = 'https://registry.npmjs.org/'
	const url = register + npmName
	return axios.get(url).then(response => {
		try {
			return response.data
		} catch (error) {
			return Promise.reject(error)
		}
	})
}

export function getLatestVersion(npmName) {
	return getNpmInfo(npmName).then(data => {
		if (!data['dist-tags'] || !data['dist-tags'].latest) {
			log.error(`’${npmName}‘ 没有 latest 版本号`)
			return Promise.reject(new Error(`’${npmName}‘ 没有 latest 版本号`))
		}
		return data['dist-tags'].latest
	})
}