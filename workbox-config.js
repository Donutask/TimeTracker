module.exports = {
	globDirectory: 'app/',
	globPatterns: [
		'**/*.{ico,svg,txt,html,js,css}'
	],
	swDest: 'app/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};