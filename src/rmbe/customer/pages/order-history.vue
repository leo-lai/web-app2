<template>
  <f7-page name="order-history">
    <f7-navbar title="消费记录" back-link="返回" sliding></f7-navbar>
    <f7-list class="l-fs-m" style="margin:0;">
      <f7-list-item v-for="item in list.data" key="order_id">
        <div slot="inner" style="width: 100%;">
          <div>
            <p>单号：{{item.order_id}}</p>
            <p>时间：{{item.create_time}}</p>
            <p>商家：{{item.store_name}}</p>
            <p>金额：<b class="l-fs l-text-main">{{item.amount ? (item.amount / 100).toFixed(2) : 0}}元</b></p>
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
    },
    back() {
      this.$router.back()
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