<template>
  <f7-page name="pay">
    <f7-navbar title="支付确认" sliding>
    </f7-navbar>
    <f7-list>
      <f7-list-item title="类型" after="启动设备"></f7-list-item>
      <f7-list-item title="金额" :after="data.amount + '元'"></f7-list-item>
      <f7-list-item title="备注" :after="data.desc"></f7-list-item>
    </f7-list>
    <div class="l-margin">
      <f7-button big fill @click="payNow">确定支付</f7-button>  
    </div>
    <div class="l-margin">
      <f7-button big fill @click="back" color="green">返回</f7-button>  
    </div>

  </f7-page>
</template>
<script>
export default {
  name: 'pay',
  data() {
    return {
      userInfo: {},
      formData: {},
      data: {}
    }
  },
  methods: {
    payNow() {
      this.formData.open_id = this.data.openid
      this.$f7.showIndicator()
      this.$$api.pay.create(this.formData).then(({data}) => {
        if(this.formData.coupon_type !== 'times'){
          this.$$api.wxpay(data).then(_ => {
            this.$f7.alert('支付成功，设备启动成功', _ => {
              this.back()
            })
          }).catch(_ => {
            this.$f7.alert('支付失败，设备启动失败')
          })
        }else {
          this.$f7.alert('该设备启动成功', _ => {
            this.back()
          })
        }
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    back() {
      this.$$storage.local.remove('pay_form')
      window.location.replace(this.$$config.host + this.$$utils.url.getRootPath() + '/device/?no=' + this.formData.number)
    }
  },
  mounted() {
    this.data = this.$$utils.url.getArgs()
    this.formData = this.$$storage.local.get('pay_form')
    if(this.formData) {
      this.data.amount = this.formData.money ? this.formData.money/100 : 0
      if(this.formData.coupon_type === 'times') {
        this.data.desc = '使用次数券'
      }else if(this.formData.coupon_type === 'full_cut') {
        this.data.desc = '使用满减券'
      }else {
        this.data.desc = ''
      }
      this.payNow()  
    }else{
      this.$f7.alert('支付信息不全，请返回重新支付')
    }
  }
}
</script>