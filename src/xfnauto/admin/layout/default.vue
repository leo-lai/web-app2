<template>
	<div id="app">
		<el-container direction="vertical " class="l-h100" :class="{'l-fullscreen': fullscreen}">
	    <el-header class="l-header l-flex-hc">
	    	<div class="l-header-logo">喜蜂鸟管理后台</div>
    		<div class="l-rest l-header-nav">
    			<el-menu class="l-menu" :default-active="$route.path" mode="horizontal" :router="true"
    				background-color="#334057" text-color="#b7c3d1" active-text-color="#21a0ff">
    				<el-menu-item index="/">&ensp;首页&ensp;</el-menu-item>
					  <el-menu-item index="/stock">库存管理</el-menu-item>
					  <el-menu-item index="/customer">客户体系</el-menu-item>
					  <el-submenu index="/base">
					    <template slot="title">基础设置</template>
					    <el-menu-item index="/base/setting">基本设置</el-menu-item>
					    <el-menu-item index="/base/data">资料设置</el-menu-item>
					  </el-submenu>
					  <el-menu-item index="/bank">银行资料审核</el-menu-item>
					</el-menu>
    		</div>
    		<div class="l-text-right l-padding-lr">
    			<el-dropdown size="medium" trigger="click">
					  <span class="el-dropdown-link">
					    {{userInfo.realName}}<i class="el-icon-setting l-fs-m l-margin-l-s" title="个人设置"></i>
					  </span>
					  <el-dropdown-menu slot="dropdown">
					    <el-dropdown-item @click.native="pwdForm.visible = true">修改密码</el-dropdown-item>
					    <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
					<span class="l-margin-l-s" @click="fullScreen">
						<i class="el-icon-rank l-fs-m" title="切换全屏"></i>
					</span>
    		</div>
	    </el-header>
	    <!-- <el-header class="l-header-tabs">
	    	<el-tabs type="card">
				  <el-tab-pane :closable="false" label="首页" name="index"></el-tab-pane>
			    <el-tab-pane :closable="true" label="配置管理" name="second"></el-tab-pane>
				</el-tabs>
	    </el-header> -->
      <el-main class="l-main">
      	<!-- <div class="l-breadcrumb" v-show="$route.path !== '/'">
	      	<el-breadcrumb separator-class="el-icon-arrow-right">
					  <el-breadcrumb-item v-if="item.path" v-for="item in $route.matched" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
					</el-breadcrumb>	
      	</div> -->
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
	  </el-container>
		<el-dialog title="修改密码" :visible.sync="pwdForm.visible" width="480px">
  		<el-form ref="pwdForm" :model="pwdForm.data" :rules="pwdForm.rules" label-width="100px" style="width: 432px;">
			  <el-form-item label="旧密码" prop="passwordOld">
			    <el-input type="password" v-model="pwdForm.data.passwordOld" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码" prop="password">
			    <el-input type="password" v-model="pwdForm.data.password" auto-complete="off"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button :disabled="pwdForm.loading" @click="pwdForm.visible = false">取消</el-button>
		    <el-button type="primary" :loading="pwdForm.loading" @click="submitPwd">确定修改</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'

export default {
	name: 'frame',
  data() {
    return {
    	pwdForm: {
    		visible: false,
				loading: false,
				data: {
					passwordOld: '',
					password: '',
				},
				rules: {
					passwordOld: [
						{required: true, message: '请输入旧密码', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入新密码', trigger: 'blur'}
					]
				}
    	}
    }
  },
  computed: {
  	...mapGetters([
  		'userInfo',
  		'userMenus',
  		'fullscreen',
      'collapse'
    ])
  },
  methods: {
  	doCollapse() {
  		this.$store.dispatch('toggleCollapse')
  	},
  	initSomething() {
  		// 全屏设置
	  	if (screenfull.enabled) {
				screenfull.on('change', () => {
					this.$store.dispatch('toggleFullscreen', screenfull.isFullscreen)
				})
			}
			document.addEventListener('keyup', e => {
				e = e || window.event
				if (e && e.keyCode === 122){
					this.fullScreen()
				}
			})

			// window.onbeforeunload = function (e) {
			// 	return '确定离开此页吗？' 
			// }
  	},
  	fullScreen() {
  		if (!screenfull.enabled) {
        this.$message({
          message: 'sorry, you browser can not work!',
          type: 'warning'
        })
        this.$store.dispatch('toggleFullscreen')
        return false
      }
      screenfull.toggle()
  	},
  	logout() {
  		const loading = this.$loading()
  		this.$store.dispatch('logout').finally(_ => {
  			loading.close()
  		})
  	},
  	submitPwd() {
  		let that = this
  		that.$refs.pwdForm.validate(valid => {
        if (valid) {
          that.pwdForm.loading = true
          that.$$api.auth.changePwd(that.pwdForm.data).then(_ => {
            that.$message({
							type: 'success',
							message: '修改密码成功'
						})
						that.$refs.pwdForm.resetFields()
						that.pwdForm.visible = false
          }).finally(_ => {
            that.pwdForm.loading = false
          })
        }else {
        	that.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
  	}
  },
  mounted() {
  	this.initSomething()
  }
}
</script>
