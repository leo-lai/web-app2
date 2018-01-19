import { storage, utils } from 'assets/js/utils'
import { userMenus } from '../router/routes'
import api from '../api'
import router from '../router'
let _cache = {
	userMenus: storage.local.get('usermenus') || userMenus
}
const user = {
	state: {
		fetching: false,
		info: storage.local.get('userinfo'),
		menus: []
	},
	mutations: {
		USER_INFO: (state, info = {}) => {
			storage.local.set('userinfo', info)
			state.info = info
		},
		USER_MENUS: (state, menus = []) => {
			storage.local.set('usermenus', menus)
			state.menus = menus
		}
	},
	actions: {
		login({ commit }, formData) {
			return api.auth.login(formData).then(({data}) => {
				commit('USER_INFO', data)
				return data
			})
		},
		logout({ commit }, toLogin = true) {
			return api.auth.logout(toLogin)
		},
		getUserMenus({ commit }) {
			// router.addRoutes(userMenus)
			commit('USER_MENUS', _cache.userMenus)
		}
	}
}

export default user