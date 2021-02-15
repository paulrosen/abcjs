const path = require('path')

module.exports = (env, argv) => {
	return {
		entry: './fonts/font.js',
		mode: 'production',
		optimization: {
			usedExports: true
		}
	}
};

