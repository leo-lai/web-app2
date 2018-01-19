<template>
  <f7-page name="coupon">
    <f7-navbar title="优惠券" back-link="返回" sliding></f7-navbar>
    <f7-list style="margin:0;">
		  <f7-list-item title="满减券" link="/coupon/fullcut/"></f7-list-item>
		  <f7-list-item title="次数券" link="/coupon/times/"></f7-list-item>
		  <f7-list-item title="发放优惠券" link="/coupon/send/"></f7-list-item>
		  <f7-list-item title="发放记录" link="/coupon/record/"></f7-list-item>
		</f7-list>
  </f7-page>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	mounted() {
	}
}
</script>