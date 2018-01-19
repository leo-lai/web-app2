import routes from './routes'
let isWechat = /micromessenger/i.test(navigator.userAgent)
let isProd = Object.is(process.env.NODE_ENV, 'production')
let config = {
	host: window.location.origin,
	apiURL: '',

	framework7: {
		root: '#app',
		// hideNavbarOnPageScroll: true,
		swipeBackPage: !isWechat,
		pushState: true,
		pushStateRoot: '/',
		pushStateSeparator: isProd ? 'wx' : 'h5',
		pushStateNoAnimation: true,
		pushStatePreventOnLoad: false,
		modalTitle: '系统提示',
		modalButtonOk: '确定',
		modalButtonCancel: '取消',
		modalPreloaderTitle: '加载中...',
		popupCloseByOutside: false,
		routes
	}
}

export default config