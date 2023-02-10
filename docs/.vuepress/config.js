import { defaultTheme } from '@vuepress/theme-default'
export default {
	base: "/abcjs/",
	title: "abcjs",
	description: "JavaScript library for displaying sheet music in a browser.",
	theme: defaultTheme({
		logo: '/img/abcjs_comp_extended_08.svg',
		displayAllHeaders: true,
		sidebar: require("./sidebar")
	}),
	head: [
		['link', { rel: 'icon', href: '/abcjs/favicon.ico' }],
		['link', { rel:"stylesheet", type: "text/css", href: 'https://paulrosen.github.io/abcjs/abcjs-audio.css'}],
		['script', { src: "https://paulrosen.github.io/abcjs/dist/abcjs-basic.js", type:"text/javascript" }]
	],
};
