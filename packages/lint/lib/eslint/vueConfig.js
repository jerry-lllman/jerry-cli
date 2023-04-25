export default {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/recommended',
		'plugin:@typescript-eslint/recommended',
		"@antfu/eslint-config-vue"
	],
	plugins: [
		'vue'
	],
	settings: {
	},
	rules: {
		
	}
}