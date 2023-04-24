export default {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		"@antfu/eslint-config-react"
	],
	plugins: [
		'react',
		'react-hooks',
		'@typescript-eslint',
	],
	settings: {
		'react': {
			'version': 'detect'
		},
	},
	rules: {
		
	}
}