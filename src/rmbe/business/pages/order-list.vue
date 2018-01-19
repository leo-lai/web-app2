<template>
  <f7-page name="order-list">
    <f7-navbar title="订单列表" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
    	<f7-list-item v-for="item in list.data" key="order_id">
        <div slot="inner" style="width: 100%;">
          <div class="l-flex-h" style="padding-top: 0.25rem;">
            <div class="l-margin-r" v-if="item.thumb"><img class="l-avatar" :src="item.thumb" style="width: 50px; height: 50px;"></div>
            <div class="l-rest">
              <p class="l-text-nowrap">昵&emsp;&emsp;称： {{item.nickname}}</p>
              <p class="l-text-nowrap">手机号码： {{item.tel}}</p>
            </div>
            <div>
            	<b class="l-fs l-text-main">{{item.amount ? (item.amount / 100).toFixed(2) : 0}}元</b>
            </div>
          </div>
          <div class="l-margin-t">
            <p>单号：{{item.order_id}}</p>
            <p>时间：{{item.create_time}}</p>
          </div>
        </div>
      </f7-list-item>
		</f7-list>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
    </infinite-loading>
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
      }
		}
	},
  methods: {
    resetInfinite() {
      this.$refs.infinite.$emit('$InfiniteLoading:reset')
      this.onInfinite(1)
    },
    onInfinite(page) {
      this.$$api.order.getList(this.list.filter, page || this.list.page).then(data => {
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