<template>
  <f7-page name="coupon">
    <f7-navbar title="个人中心" back-link="返回" sliding></f7-navbar>
    <div class="l-padding l-bg-white l-flex-hc">
    	<div class="l-margin-r">
    		<img class="l-avatar" :src="userInfo.thumb" alt="">
    	</div>
    	<div class="l-rest">
      	<p>昵称：{{userInfo.nickname}}</p>
      	<p>手机号码：{{userInfo.tel}}</p>
      </div>
    </div>
    <f7-buttons class="l-remind-tab">
		  <f7-button tab-link="#tab-1" active>满减券</f7-button>
		  <f7-button tab-link="#tab-2">次数券</f7-button>
		</f7-buttons>
    <f7-tabs>
		  <f7-tab id="tab-1" active>
				<div class="l-padding l-bg-white l-border-b" v-for="item in full_cut.list">
					<p>{{item.title}}</p>
					<p>{{item.create_time}}</p>
				</div>
				<div class="l-padding l-text-gray l-text-center" v-if="full_cut.isAjax && full_cut.list.length === 0">暂无满减券</div>
		  </f7-tab>
		  <f7-tab id="tab-2">
				<div class="l-padding l-bg-white l-border-b" v-for="item in times.list">
					<p>{{item.title}}</p>
					<p>{{item.create_time}}</p>
				</div>
				<div class="l-padding l-text-gray l-text-center" v-if="times.isAjax && times.list.length === 0">暂无次数券</div>
		  </f7-tab>
		</f7-tabs>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			full_cut: {
				isAjax: false,
				list: []
			},
			times: {
				isAjax: false,
				list: []
			}
		}
	},
	methods: {
		getCouponList(type = 'full_cut') {
			this.$f7.showIndicator()
  		this.$$api.pay.getCouponList({
  			type
  		}).then(({data}) => {
  			this.isAjax = true
  			this[type].list = data.list
  		}).finally(_ => {
  			this.$f7.hideIndicator()
  		})
		}
	},
	mounted() {
		this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
			this.getCouponList('full_cut')
			this.getCouponList('times')
    })
	}
}
</script>
<style lang="less">
.l-remind-tab{
	border-bottom: 0.025rem solid #e2dfdf;
	.tab-link{border-radius: 0 !important; padding: 0.4rem; height: auto;border:none !important;}
}
</style>