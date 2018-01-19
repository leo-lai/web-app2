<template>
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main Views -->
    <f7-views theme="lightblue">
      <f7-view id="main-view" navbar-fixed main :dynamic-navbar="true">
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>首页</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page name="index">
            <table class="l-index-menu">
              <tr>
                <td colspan="2" style="background: #5ac8fa; color: #fff; height: 6rem;">
                  <f7-link class="l-margin l-text-center" href="/user/coupon/">
                    <img class="l-avatar" :src="userInfo.thumb" alt="">
                    <p class="l-margin-t" style="color:#fff;">{{userInfo.nickname}}</p>
                  </f7-link>
                </td>
              </tr>
              <tr>
                <td>
                  <!-- <f7-link :href="`${$$config.shopURL}?rtoken=${userInfo.token}&uid=${userInfo.id}`" external>
                    <f7-icon f7="briefcase_fill"></f7-icon>
                    <p>商城</p>
                  </f7-link> -->
                  <f7-link>
                    <f7-icon f7="briefcase_fill"></f7-icon>
                    <p>商城</p>
                  </f7-link>
                </td>
                <td>
                  <f7-link href="/order/history/">
                    <f7-icon f7="card_fill"></f7-icon>
                    <p>消费记录</p>
                  </f7-link>
                </td>
                <tr>
                  <td colspan="2" height="100">
                    <div class="l-margin">
                      <f7-button big fill @click="test">测试设备</f7-button>
                    </div>
                  </td>
                </tr>
              </tr>
            </table>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'index',
	data() {
    const that = this
		return {
      loginForm: {
        nickname: '',
        open_id: '',
        thumb: ''
      }
		}
	},
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
	methods: {
    checkLogin() {
      let args = this.$$utils.url.getArgs()
      this.$store.dispatch('checkLogin', args).then(userInfo => {
        this.$$event.$emit('user:login', userInfo)
      }).catch(urlParams => {
        this.$$utils.copyObj(this.loginForm, urlParams)
        this.loginSubmit()
      })
    },
    loginSubmit() {
      this.$f7.showIndicator()
      this.$store.dispatch('login', this.loginForm).then(userInfo => {
        this.$$event.$emit('user:login', userInfo)
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    test() {
      window.location.href = this.$$utils.url.getRootPath() + '/device/?no=232485'
    }
	},
  watch: {
    userInfo(val) {
      if(!val){
        this.checkLogin()
      }
    }
  },
	mounted() {
    this.checkLogin()
    this.$nextTick(_ => {
      setTimeout(_ => {
        this.$f7.onPageInit('*', page => {
          this.$$api.auth.check().then(userInfo => {
            this.$$event.$emit('user:login', userInfo)
          })
        })
      })
    })
	}
}
</script>
<style lang="less">
@import 'framework7/dist/css/framework7.ios.min.css';
@import 'framework7/dist/css/framework7.ios.colors.min.css';
@import 'framework7-icons/css/framework7-icons.css';
@import '~assets/css/font.less';
@import '~assets/css/base.less';
@import '../assets/framework7.less';
body{font-size: 0.75rem;}
.l-index-menu{
  width: 100%; background-color: #fff;
  text-align: center;
  border-spacing: 0; border-collapse: collapse;
  td{
    width: 50%;
    border: 1px solid #e2dfdf; padding: 0.5rem 0;
    i~p{margin: 0.5rem 0 0 0; color: #333;}
  }
  td:active{background-color: #e2dfdf;}
  .link{display: block;padding: 1rem 0;}
}
.list-block select{-webkit-appearance: menulist-button;appearance: menulist-button;}
</style>
