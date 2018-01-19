<template>
  <div id="app">
    <!-- Status bar overlay for full screen mode (Cordova or PhoneGap) -->
    <f7-statusbar></f7-statusbar>

    <!-- Views -->
    <f7-views theme="lightblue">
      <!-- Your main view, should have "view-main" class -->
      <f7-view main id="main-view" :dynamic-navbar="true">
        <!-- For iOS theme we use navbar-through layout so the navbar should be a child of the View -->
        <f7-navbar v-if="$theme.ios" sliding title="首页">
          <!-- <f7-nav-center sliding>首页</f7-nav-center> -->
          <f7-nav-right v-if="userInfo">
            <f7-link text="注销" @click="logoutSubmit"></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <!-- Pages container, because we use fixed navbar and toolbar, it has additional appropriate props -->
        <f7-pages navbar-fixed>
          <!-- Initial Page -->
          <f7-page name="index">
            <!-- For Material theme we use navbar-fixed layout so the navbar should be a child of the Page -->
            <f7-navbar v-if="$theme.material" title="首页">
              <f7-nav-right v-if="userInfo">
                <f7-link text="注销" @click="logoutSubmit"></f7-link>
              </f7-nav-right>
            </f7-navbar>

            <!-- Top Navbar-->
            <!-- Toolbar-->

            <!-- Page Content -->
            <table class="l-index-menu">
              <tr>
                <td colspan="2" style="background: #5ac8fa; color: #fff; height: 6rem;">
                  <p class="l-fs-s">今日收益</p>
                  <p class="l-fs-xl">￥<b>{{index.today_sum}}</b></p>
                </td>
              </tr>
              <tr>
                <td>
                  <f7-link href="/wallet/">
                    <f7-icon f7="card_fill"></f7-icon>
                    <p>钱包</p>  
                  </f7-link>
                </td>
                <td>
                  <f7-link href="/device/list/">
                    <f7-icon f7="drawers_fill"></f7-icon>
                    <p>设备</p>
                  </f7-link>
                </td>
              </tr>
              <tr>
                <td>
                  <f7-link :href="`${$$config.shopURL}?rtoken=${userInfo.token}&uid=${userInfo.id}`" external>
                    <f7-icon f7="briefcase_fill"></f7-icon>
                    <p>商城</p>
                  </f7-link>
                </td>
                <td>
                  <f7-link class='l-rel' href="/remind/list/">
                    <f7-icon f7="chat_fill"></f7-icon>
                    <i v-if="userInfo.alter" class="l-reddot"></i>
                    <p>提醒</p>
                  </f7-link>
                </td>
              </tr>
              <tr>
                <td>
                  <f7-link href="/order/list/">
                    <f7-icon f7="list_fill"></f7-icon>
                    <p>订单</p>
                  </f7-link>
                </td>
                <td>
                  <f7-link href="/coupon/">
                    <f7-icon f7="ticket_fill"></f7-icon>
                    <p>优惠券</p>
                  </f7-link>
                </td>
              </tr>
            </table>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>

    <!-- Login Screen -->
    <f7-login-screen id="login-screen" theme="lightblue">
      <f7-view>
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title>欢迎登录</f7-login-screen-title>
            <div class="l-margin l-text-center">
              <img class="l-avatar" :src="loginForm.thumb" alt="">
            </div>
            <f7-list form class="l-padding">
              <f7-list-item>
                <f7-label>账号</f7-label>
                <f7-input v-model="loginForm.username" type="text" placeholder="请输入账号"></f7-input>
              </f7-list-item>
              <f7-list-item>
                <f7-label>密码</f7-label>
                <f7-input v-model="loginForm.password" type="password" placeholder="请输入密码"></f7-input>
              </f7-list-item>
            </f7-list>
            <f7-list class="l-padding">
              <f7-button fill big @click="loginSubmit">登录</f7-button>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>

    <!-- Popup. All modals should be outside of Views -->
    <f7-popup id="popup">
      <f7-view>
        <f7-pages navbar-fixed>
          <f7-page>
            <f7-navbar title="Popup">
              <!-- Link to close popup -->
              <f7-nav-right>
                <f7-link close-popup>Close</f7-link>
              </f7-nav-right>
            </f7-navbar>
            <f7-block>
            </f7-block>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'index',
	data() {
		return {
      index: {
        all_sum: 0,
        today_sum: 0
      },
      loginForm: {
        username: '',
        password: '',
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
        this.$$api.index.getInfo().then(({data}) => {
          if(data){
            this.index.all_sum = (Number(data.all_sum) / 100).toFixed(2)
            this.index.today_sum = (Number(data.today_sum) / 100).toFixed(2)
          }
        })
        this.$f7.closeModal()
      }).catch(urlParams => {
        this.$$utils.copyObj(this.loginForm, urlParams)
        this.$f7.loginScreen()
      })
    },
    loginSubmit() {
      if(!this.loginForm.username) {
        this.$$utils.toptip('请输入账号')
        return
      }
      if(!this.loginForm.password) {
        this.$$utils.toptip('请输入密码')
        return
      }

      this.$f7.showIndicator()
      this.$store.dispatch('login', this.loginForm).then(userInfo => {
        this.$$event.$emit('user:login', userInfo)
        this.$f7.closeModal()
      }).finally(_ => {
        this.$f7.hideIndicator()
      })
    },
    logoutSubmit() {
      this.$f7.showIndicator()
      this.$store.dispatch('logout').finally(_ => {
        this.$f7.hideIndicator()
      })
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
    this.$nextTick(_ => {
      setTimeout(_ => {
        this.$f7.onPageInit('*', page => {
          this.$$api.auth.check().then(userInfo => {
            this.$$event.$emit('user:login', userInfo)
          })
        })

        this.checkLogin()
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
</style>
