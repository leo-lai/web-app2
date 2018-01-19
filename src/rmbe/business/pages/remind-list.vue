<template>
  <f7-page name="remind-list">
    <f7-navbar title="系统提醒" back-link="返回" sliding></f7-navbar>
    <f7-subnavbar style="padding:0;">
		  <f7-buttons class="l-remind-tab">
			  <f7-button tab-link="#tab-1" active>物流提醒</f7-button>
			  <f7-button tab-link="#tab-2">充值提醒</f7-button>
			</f7-buttons>
		</f7-subnavbar>
    <f7-tabs>
		  <f7-tab id="tab-1" active>
				<div class="l-padding l-bg-white l-border-b" v-for="item in list1">
					<p>设&ensp;备&ensp;号：{{item.number}}</p>
					<p v-if="item.alias">设备别名：{{item.alias}}</p>
					<p class="l-text-error">机器物料不足，请及时联系工厂配货</p>
					<p class="l-text-gray">{{item.alter_time}}</p>
				</div>
				<div class="l-padding l-text-gray l-text-center" v-if="isAjax && list1.length === 0">暂无提醒</div>
		  </f7-tab>
		  <f7-tab id="tab-2">
				<div class="l-padding l-bg-white l-border-b" >
					<p class="l-text-error">{{list2.title}}</p>
					<p class="l-text-gray">{{list2.alter_time}}</p>
				</div>
		  </f7-tab>
		</f7-tabs>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
			isAjax: false,
			list1: [],
			list2: {}
		}
	},
	methods: {
		getList1() {
			this.$f7.showIndicator()
  		this.$$api.device.remindList().then(data => {
  			this.isAjax = true
  			this.list1 = data
  		}).finally(_ => {
  			this.$f7.hideIndicator()
  		})
		},
		getList2() {
			this.$f7.showIndicator()
  		this.$$api.wallet.remindList().then(data => {
  			this.list2 = data
  		}).finally(_ => {
  			this.$f7.hideIndicator()
  		})
		}
	},
	mounted() {
		this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
      this.getList1()
			this.getList2()
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