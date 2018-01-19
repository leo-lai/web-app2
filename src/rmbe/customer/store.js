import Vue from 'vue'
import Vuex from 'vuex'
import { storage, utils } from 'assets/js/utils'
import api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  	userInfo: storage.local.get('customer_userinfo')
  },
  getters: {
  	userInfo: state => state.userInfo
  },
  mutations: {
		USER_INFO: (state, userInfo) => {
			storage.local.set('customer_userinfo', userInfo)
			state.userInfo = userInfo
		}
	},
	actions: {
		checkLogin({ commit }, urlParams = {}) {
			return new Promise((resolve, reject) => {
				let userInfo = storage.local.get('customer_userinfo')
				if(userInfo && userInfo.open_id){
					store.dispatch('getUserInfo')
					commit('USER_INFO', userInfo)
					resolve(userInfo)
				}else {
					let wxInfo = storage.local.get('customer_wxInfo')
					if(wxInfo && wxInfo.open_id) {
						reject(wxInfo)
					}else if(urlParams.open_id) {
						storage.local.set('business_wxInfo', {
							open_id: urlParams.open_id,
							thumb: urlParams.thumb,
							nickname: urlParams.nickname
						}, 10 * 60 * 1000)
						reject(urlParams)
					}else {
						api.auth.grant(window.location.href)
					}
				}
			})
		},
		login({ commit }, formData) {
			formData = formData || storage.local.get('customer_wxInfo')
			return api.auth.login(formData).then(userInfo => {
				storage.local.set('customer_wxInfo', {
					open_id: formData.open_id,
					thumb: formData.thumb,
					nickname: formData.nickname
				})
				commit('USER_INFO', userInfo)
				store.dispatch('getUserInfo')
				return userInfo
			})
		},
		logout({ commit }, remote = false) {
			return api.auth.logout(remote).finally(_ => {
				commit('USER_INFO', '')
			})
		},
		getUserInfo({ commit }) {
			return api.auth.getInfo().then(({data}) => {
				commit('USER_INFO', Object.assign(storage.local.get('customer_userinfo'), data))
			})
		}
	}
})

export default store