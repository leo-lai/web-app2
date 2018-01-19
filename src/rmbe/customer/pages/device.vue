<template>
  <f7-page name="device">
    <f7-navbar :title="title" sliding></f7-navbar>
    <div class="l-panel-pay">
      <p class="l-text-gray l-fs-m">支付金额</p>
      <div class="_ipt _ipt2 l-flex-hc">
        <b style="margin: 0.25rem 0.75rem 0 0 ;">￥</b>
        <div class="l-rest">
          <span v-show="!money">点击这里输入金额</span>
          <input ref="money" v-model="money" readonly @click="showKeyboard($event.target)" placeholder="">  
        </div>
      </div>
    </div>
  
    <div class="l-margin">
      <f7-list form style="margin:0;">
        <f7-list-item>
          <f7-label style="width:auto;">选择优惠券：</f7-label>
          <f7-input type="select" v-model="couponType" @change="getCouponList">
            <option value="full_cut">满减券</option>
            <option value="times">次数券</option>
          </f7-input>
        </f7-list-item>
      </f7-list>
      <f7-list class="l-scroll" form style="margin:0; max-height: 15.0rem;">
        <f7-list-item radio name="coupon" :title="item.title + (item.type === 'times' ? '（剩余次数：'+ item.device_count +'）' : '')" v-for="item in couponList" key="id" @click="couponSlt(item)"></f7-list-item>
      </f7-list>
      <div v-if="couponList.length === 0" class="l-padding l-text-gray l-text-center">暂无可用{{couponText[couponType]}}</div>
    </div>
    <div style="margin: 2rem 1rem;">
      <f7-button big fill @click="pay">启动设备</f7-button>
    </div>

    <number-keyboard ref="numberKeyboard" :nk-length="10"></number-keyboard>
  </f7-page>
</template>

<script>
import NumberKeyboard from 'components/number-keyboard'
export default {
  name: 'device',
  components: {
    NumberKeyboard
  },
	data() {
		return {
      title: '启动设备',
      number: '',
      userInfo: {},
      deviceInfo: {},
      couponText: {
        'full_cut': '满减券',
        'times': '次数券'
      },
      couponType: 'full_cut',
      couponList: [],
      couponSlted: {},
      money: ''
		}
	},
	methods: {
    showKeyboard(input) {
      this.$refs.numberKeyboard.$emit('$keyboard:show', input)
    },
    getDeviceInfo() {
      this.$f7.showIndicator()
      this.$$api.pay.getDeviceInfo(this.number).then(({data}) => {
        if(data && data.device_remain_count > 0){
          this.deviceInfo = data
          this.title = data.store_name || this.title

          this.getCouponList()
        }else {
          this.$f7.hideIndicator()
          this.$f7.alert('该设备次数不足，请告知商家充值。')
        }
        return data
      }).catch(_ => {
        this.couponSlted = {}
        this.$f7.hideIndicator()
      })
    },
    getCouponList() {
      this.$f7.hideIndicator()
      this.$$api.pay.getCouponList({
        seller_id: this.deviceInfo.seller_id,
        type: this.couponType
      }).then(({data}) => {
        this.couponSlted = {}
        this.couponList = data.list
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    couponSlt(item) {
      this.couponSlted = item
    },
    pay() {
      let formData = {
        seller_id: this.deviceInfo.seller_id,
        open_id: this.userInfo.open_id,
        number: this.number
      }

      if(this.couponSlted && this.couponSlted.id){
        formData.type = 'coupon'
        formData.coupon_type = this.couponSlted.type
        formData.coupon_id = this.couponSlted.id
      }else {
        formData.type = 'buy'
      }

      if(formData.coupon_type !== 'times'){
        if(!this.money) {
          this.$$utils.toptip('请输入支付金额')
          return
        }
        formData.money = Number(this.money) * 100
      }

      this.$$storage.local.set('pay_form', formData)
      this.$f7.showIndicator()
      this.$$api.auth.pay(formData.seller_id).then(({data}) => {
        window.location.replace(data.url)
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    }
	},
  mounted() {
    this.$refs.numberKeyboard.$on('$keyboard:input', (val)=>{
      this.money = val
    })

    this.$$event.$once('user:login', userInfo => {
      this.userInfo = userInfo

      let args = this.$$utils.url.getArgs()
      if(args.no) {
        this.number = args.no 
        this.getDeviceInfo()
      }else {
        this.$f7.alert('该设备不可用，请联系商家。')
      }
    })
  }
}
</script>

<style scoped lang="less">
.l-panel-pay{
  margin: 0.75rem; background-color: #fff; padding: 1rem;
  ._ipt2{
    input::-webkit-input-placeholder{
      /* font-size: 0.85rem; */ color: #333;
      transform: translate3d(0, 0, 0) scale(0.6); 
      transform-origin: 0 50%; 
    }  
  }
  ._ipt{
    padding: 0.75rem 0 0 0; position: relative; z-index: 0;
    input{
      width: 100%; margin:0; padding: 0; background-color: transparent;
      border:none;  font-size: 1.6rem; line-height: 1;  position: relative; z-index: 2;
    }
    
    span{
      position: absolute; top:1.2rem; left: 2.25rem; color: #333; pointer-events: none; z-index: -1;
    }
  }
}
</style>