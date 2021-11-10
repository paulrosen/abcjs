module.exports = {
	base: "/abcjs/",
	title: "abcjs",
	description: "JavaScript library for displaying sheet music in a browser.",
	themeConfig: {
		logo: '/img/abcjs_comp_extended_08.svg',
		displayAllHeaders: true,
		sidebar: require("./sidebar")
	},
	head: [
		['link', { rel: 'icon', href: '/abcjs/favicon.ico' }]
	],
};
