<template>
  <f7-page name="coupon">
    <f7-navbar title="次数券" back-link="返回" sliding>
    	<f7-nav-right>
        <f7-link text="生成" icon-f7="add_round" @click="couponOpen"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-list style="margin:0;">
		  <f7-list-item :title="item.title" :after="'剩余：'+item.rest_count+'张'" v-for="item in list.data" key="id"></f7-list-item>
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
        <f7-nav-center>生成满减券</f7-nav-center>
        <f7-nav-right></f7-nav-right>
      </f7-navbar>
      
      <div class="l-text-center l-padding l-text-error">
        剩余设备使用次数：{{userInfo.rest_device_count}}
      </div>
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label>次数</f7-label>
          <f7-input type="tel" placeholder="请输入优惠券次数" v-model="coupon.data.device_count" :maxlength="7"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>张数</f7-label>
          <f7-input type="tel" placeholder="请输入生成张数" v-model="coupon.data.count" :maxlength="7"/>
        </f7-list-item>
      </f7-list>
      <f7-block><f7-button fill big @click="couponSave">确定生成</f7-button></f7-block>
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
        filter: {
          type: 'times'
        },
        page: 1,
        data: []
      },
			coupon: {
				opened: false,
				data: {
          type: 'times',
          device_count: '',
          count: '',
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
      this.$$api.coupon.getList(this.list.filter, page || this.list.page).then(data => {
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
    couponOpen(item) {
      this.$store.dispatch('getUserInfo')
      this.coupon.opened = true
    },
    couponClose(item) {
      this.coupon.opened = false
    },
    couponSave() {
      if(!/^\d{1,}$/.test(this.coupon.data.device_count)) {
        this.$$utils.toptip('请输入优惠券次数(整数)')
        return
      }
      if(!/^\d{1,}$/.test(this.coupon.data.count)) {
        this.$$utils.toptip('请输入生成张数(整数)')
        return
      }

      if(this.coupon.data.device_count * this.coupon.data.count > this.userInfo.rest_device_count){
        this.$$utils.toptip('优惠券次数大于剩余设备使用次数')
        return 
      }

      this.$f7.showIndicator()
      this.$$api.coupon.add(this.coupon.data).then(({data}) => {
        this.couponClose()
        this.resetInfinite()
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
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