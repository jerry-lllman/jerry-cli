import axios from 'axios'

function getNpmInfo(npmName) {
	const register = 'https://registry.npmjs.org/'
	const url = register + npmName
	return axios.get(url).then(response => {
		console.log(response)
	})
}

export function getLatestVersion(npmName) {
	return getNpmInfo(npmName)
}