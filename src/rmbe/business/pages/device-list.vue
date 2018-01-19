<template>
  <f7-page name="device-list">
    <f7-navbar title="设备列表" back-link="返回" sliding></f7-navbar>
    <!-- Search bar -->
    <f7-searchbar cancel-link="取消" placeholder="输入设备别名/设备编号" :clear="true" 
      @input="onSearch" @click:clear="onClear" @click:cancel="onClear">
    </f7-searchbar>

    <!-- Search-through list -->
    <div id="search-list" class="searchbar-found">
      <f7-list style="margin:0;" v-show="list.data.length > 0">
        <f7-list-item class="item-link" v-for="item in list.data" key="item" @click="openEdit(item)">
          <div slot="inner" class="l-flex-hc">
            <div class="l-rest">
              <div class="_tit">
                <p class="l-text-nowrap">编号：{{item.number}}</p>
                <p class="l-text-nowrap">别名：{{item.alias}}</p>
                <p class="l-text-nowrap">累计启动次数：{{item.start_count}}</p>
                <!-- <p class="l-text-nowrap">剩余次数：{{item.remain_count}}</p> -->
              </div>
            </div>
          </div>
        </f7-list-item>
      </f7-list>
      <infinite-loading :on-infinite="onInfinite" ref="infinite">
        <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
        <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
        <div class="l-text-gray l-fs-m" slot="no-more">没有更多了</div>
      </infinite-loading>
    </div>
    <!-- popup -->
    <f7-popup :opened="edit.opened" theme="lightblue">
      <f7-navbar sliding>
        <f7-nav-left>
          <!-- <f7-link text="返回" icon-f7="chevron_left" @click="closeEdit"></f7-link> -->
        </f7-nav-left>
        <f7-nav-center>编辑设备</f7-nav-center>
        <f7-nav-right>
          <!-- <f7-link text="保存" :disabled="edit.disabled" icon-f7="check" @click="saveEdit"></f7-link> -->
        </f7-nav-right>
      </f7-navbar>

      <f7-list form>
        <f7-list-item>
          <f7-label>设备编号</f7-label>
          <f7-input disabled type="text" :value="edit.data.number"/>
        </f7-list-item>
        <f7-list-item>
          <f7-label>设备编号</f7-label>
          <f7-input type="text" placeholder="请输入设备编号" v-model="edit.data.alias" @input="edit.disabled = false"/>
        </f7-list-item>
      </f7-list>
      <div class="l-margin">
        <f7-button big fill :disabled="edit.disabled" @click="saveEdit">保存</f7-button>  
      </div>
      <div class="l-margin">
        <f7-button big fill @click="closeEdit" color="green">返回</f7-button>  
      </div>
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
          keywords: ''
        },
        page: 1,
        data: []
      },
      edit: {
        disabled: true,
        opened: false,
        slted: {},
        data: {
          number: '',
          alias: ''
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
      this.$$api.device.getList(this.list.filter, page || this.list.page).then(data => {
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
    onSearch(query, found) {
      this.list.filter.keywords = query
      this.resetInfinite()
    },
    onClear(query, found) {
      this.list.filter.keywords = ''
      this.onInfinite(1)
    },
    openEdit(item) {
      this.edit.slted = item
      this.edit.disabled = true
      this.$$utils.copyObj(this.edit.data, item)
      this.edit.opened = true
    },
    saveEdit() {
      this.$f7.showIndicator()
      this.$$api.device.update(this.edit.data).then(({data}) => {
        this.$$utils.copyObj(this.edit.slted, this.edit.data)
      }).finally(_ => {
        this.$f7.hideIndicator()
        this.closeEdit()
      })
    },
    closeEdit(item) {
      this.edit.opened = false
    }
  },
  mounted() {
    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo
      this.resetInfinite()
    })
  },
  beforeDestroy() {
    this.closeEdit()
  }
}
</script>