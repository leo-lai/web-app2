<template>
  <f7-page name="coupon">
    <f7-navbar title="发放优惠券" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in list.data" key="id">
        <div slot="inner" style="width: 100%;">
          <div class="l-flex-hc">
            <div class="l-margin-r" v-if="item.thumb"><img class="l-avatar" :src="item.thumb"></div>
            <div class="l-rest">
              <p class="l-text-nowrap">昵&emsp;&emsp;称： {{item.nickname}}</p>
              <p class="l-text-nowrap">手机号码： {{item.tel}}</p>
            </div>
            <f7-button @click="couponOpen(item)">发放</f7-button>
          </div>
        </div>
      </f7-list-item>
		</f7-list>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
    </infinite-loading>
		<!-- popup -->
    <f7-popup :opened="coupon.opened" theme="lightblue">
      <f7-navbar>
        <f7-nav-left>
          <f7-link text="返回" icon-f7="chevron_left" @click="couponClose"></f7-link>
        </f7-nav-left>
        <f7-nav-center>发放优惠券</f7-nav-center>
        <f7-nav-right></f7-nav-right>
      </f7-navbar>
			<div class="l-flex-hc l-padding">
        <div class="l-margin-r" v-if="customer.thumb"><img class="l-avatar" :src="customer.thumb"></div>
        <div class="l-rest">
          <p class="l-text-nowrap">昵&emsp;&emsp;称： {{customer.nickname}}</p>
          <p class="l-text-nowrap">手机号码： {{customer.tel}}</p>
        </div>
      </div>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label style="width:auto;">请选择发放优惠券：</f7-label>
          <f7-input type="select" v-model="coupon.data.type" @change="getCouponList">
            <option value="full_cut">满减券</option>
            <option value="times">次数券</option>
          </f7-input>
        </f7-list-item>
      </f7-list>
      <f7-list class="l-scroll" form style="margin:0; max-height: 15.0rem;">
        <f7-list-item radio name="coupon" :title="item.title +'（剩余'+item.rest_count+'张）'" v-for="item in coupon.list" key="id" @click="couponSlt(item)"></f7-list-item>
      </f7-list>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label>数量</f7-label>
          <f7-input type="tel" v-model="coupon.data.count" placeholder="请输入发放数量" maxlength="10"/>
        </f7-list-item>
      </f7-list>


      <f7-block><f7-button fill big @click="couponSend">确定发放</f7-button></f7-block>
    </f7-popup>
  </f7-page>
</template>

<script>
import infiniteLoading from 'components/vue-infinite-loading'
export default {
  components: {
    infiniteLoading
  },
	data() {
		return {
      userInfo: {},
      list: {
        filter: {},
        page: 1,
        data: []
      },
      customer: {},
			coupon: {
				opened: false,
        list: [],
        slted: {},
				data: {
          customer_id: '',
          type: 'full_cut',
          coupon_id: '',
          count: ''
				}
			}
		}
	},
	methods: {
    resetInfinite() {
      this.$refs.infinite.$emit('$InfiniteLoading:reset')
      this.onInfinite(1)
    },
    onInfinite(page) {
      this.$$api.coupon.getCustomerList(this.list.filter, page || this.list.page).then(data => {
        let returnList = data.list
        this.list.data = data.page > 1 ? this.list.data.concat(returnList) : returnList

        if(returnList.length > 0){
          this.$nextTick(()=>{
            this.$refs.infinite.$emit('$InfiniteLoading:loaded')
          })
          
          if(returnList.length >= data.rows){
            this.list.page++
          }else{
            this.$refs.infinite.$emit('$InfiniteLoading:complete')
          }
        }else{
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }
      }).catch(_ => {
        this.$refs.infinite.$emit('$InfiniteLoading:complete')
      })
    },
    getCouponList() {
      this.$f7.showIndicator()
      return this.$$api.coupon.getList({
        type: this.coupon.data.type
      }).then(data => {
        this.coupon.slted = {}
        this.coupon.data.coupon_id = ''
        this.coupon.list = data.list
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    couponOpen(item) {
      this.customer = item
      this.coupon.data.customer_id = item.id
      this.getCouponList().finally(_ => {
        this.coupon.opened = true
      })
    },
    couponClose(item) {
      this.coupon.opened = false
    },
    couponSend() {
      if(!this.coupon.data.coupon_id) {
        this.$$utils.toptip('请选择发放优惠券')
        return
      }

      if(!/^\d{1,}$/.test(this.coupon.data.count)) {
        this.$$utils.toptip('请输入发放数量')
        return
      }

      if(this.coupon.data.count > this.coupon.slted.rest_count) {
        this.$$utils.toptip('发放数量大于剩余数量')
        return
      }

      this.$f7.showIndicator()
      this.$$api.coupon.send(this.coupon.data).then(({data}) => {
        this.couponClose()
        this.$f7.alert('优惠券发放成功')
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    couponSlt(item) {
      this.coupon.slted = item
      this.coupon.data.coupon_id = item.id
    }
	},
  mounted() {
    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
      this.resetInfinite()
    })
  }
}
</script>