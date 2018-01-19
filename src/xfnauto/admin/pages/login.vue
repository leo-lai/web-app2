<template>
  <div class="l-login-container l-flex-vhc">
    <el-form class="l-login-form" ref="loginForm" label-position="left" label-width="0px"
      :model="loginForm.data" :rules="loginForm.rules" @keyup.native.enter="submitForm">
      <h3 class="_tit">喜蜂鸟管理系统</h3>
      <el-form-item prop="phoneNumber">
        <el-input type="text" v-model.trim="loginForm.data.phoneNumber" auto-complete="off" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model.trim="loginForm.data.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox class="_remember" v-model="loginForm.remember" checked>记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%; margin-top: 1rem;" @click.native.prevent="submitForm" :loading="loginForm.loading">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="l-copy-right" style="margin-top: 1rem;">©2017-2018 广州传创金融有限公司</div>
  </div>
  
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
      	loading: false,	
      	remember: true,
      	data: {
      		phoneNumber: '',
        	password: ''
      	},
      	rules: {
      		phoneNumber: [
	          { required: true, message: '请输入账号', trigger: 'blur' },
	        ],
	        password: [
	          { required: true, message: '请输入密码', trigger: 'blur' },
	        ]
      	}
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields()
    },
    submitForm(ev) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.loading = true
          this.$store.dispatch('login', this.loginForm.data).then(_ => {
            this.$$href(this.$route.query.to || '/', 'replace')
          }).finally(()=>{
            this.loginForm.loading = false
          })  
        }
      })
    }
  },
  mounted() {
  }
}

</script>

<style scoped lang="less">
.l-login-container{
	height: 100%;
	background: #373d41;
	padding: 0.75rem;
}
.l-login-form {
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.95);
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 5px #cac6c6;
  ._tit {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  ._remember {margin: 0px 0px 35px 0px; }
}
</style>