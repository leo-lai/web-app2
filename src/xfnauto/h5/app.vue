<template>
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through main :dynamic-navbar="true">
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>淘车快</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page name="index"></f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
import Toast from 'assets/f7-toast'
export default {
  name: 'index',
	data() {
		return {
		}
	},
	mounted() {
    this.$nextTick(_ => {
      setTimeout(_ => {
        // if (this.$$utils.device.isWechat) {
        //   this.$f7.mainView.hideNavbar()
        // }
        Toast(this.$f7)
      })
    })
	}
}
</script>
<style lang="less">
@import 'framework7/dist/css/framework7.ios.min.css';
@import 'framework7/dist/css/framework7.ios.colors.min.css';
@import 'framework7-icons/css/framework7-icons.css';
@import '~assets/f7-toast/index.less';
@import '~assets/css/base.less';
@import './assets/framework7.less';
</style>
