<template>
  <f7-page name="wallet">
    <f7-navbar title="钱包管理" back-link="返回" sliding></f7-navbar>
    <div class="l-flex-hc l-padding l-bg-white">
    	<img class="l-avatar" :src="userinfo.thumb" alt="">
    	<div class="l-rest l-margin-l">
    		<p>昵称：{{userinfo.nickname}}</p>
    		<!-- <p>积分：{{0}}</p> -->
    		<p>金额：{{0}}</p>
    	</div>
    </div>

    <div class="l-margin-t">
    	<table class="l-index-menu">
        <tr>
          <td colspan="2">
            <div class="l-padding">剩余设备使用次数：{{userinfo.rest_device_count}}</div>
          </td>
        </tr>
        <tr>
          <td>
            <f7-link href="/wallet/recharge/">
              <f7-icon f7="card_fill"></f7-icon>
              <p>充值</p>  
            </f7-link>
          </td>
          <td>
            <f7-link href="/wallet/record/">
              <f7-icon f7="card_fill"></f7-icon>
              <p>充值记录</p>
            </f7-link>
          </td>
        </tr>
      </table>
    </div>	
  </f7-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
      userinfo: {}
		}
	},
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    userInfo(val) {
      if(val){
        this.userinfo = val
      }
    }
  },
  mounted() {
    this.$$event.$once('user:login', userInfo => {
      this.userinfo = userInfo
    })
  }
}
</script>