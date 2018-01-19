let config = {
	router: {
		base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
	},
	api: {
		baseURL: 'http://api.nrmbe.gzmypay.com/api/plat'
	},
	shop: {
		admin: 'http://shop.nrmbe.gzmypay.com/admin/'
	}
}

if (window.location.host.indexOf('leolai.cn') > -1) {
	config.api.baseURL = 'http://api.leolai.cn/api/plat'
	config.shop.admin = 'http://api.leolai.cn/api/plat'
}
export default config