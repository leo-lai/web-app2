<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增用户</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入门店/公司名称" v-model="list.filter.orgName"></el-input>
				  </el-form-item>
				  <el-form-item prop="realName">
				    <el-input placeholder="请输入姓名" v-model="list.filter.realName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe highlight-current-row element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="账号/手机号" prop="phoneNumber"></el-table-column>
	    <el-table-column label="真实姓名" prop="realName"></el-table-column>
	    <el-table-column label="系统角色" prop="roleName"></el-table-column>
	    <el-table-column label="所属组织" prop="orgName"></el-table-column>
	    <el-table-column label="状态" prop="status">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.isEnable === 1" class="l-text-ok">正常使用</span>
	    		<span v-else class="l-text-error">已禁用</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作">
	    	<template slot-scope="scope">
	        <span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        	<el-button v-if="scope.row.isEnable === 1" class="l-text-error" type="text" size="small" @click="enableAsk(scope.row, 0)">禁用</el-button>
	        	<el-button v-else class="l-text-ok" type="text" size="small" @click="enableAsk(scope.row, 1)">启用</el-button>	
	        </span>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-row class="l-text-center l-margin-t">
	  	<el-pagination layout="total, sizes, prev, pager, next, jumper"
	  	 	@size-change="sizeChange" 
	  	 	@current-change="pageChange" 
	  	 	:page-sizes="$$api.pageSizes"
	  	 	:page-size="list.rows"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 新增/编辑用户 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
  		<el-form class="l-form1" ref="infoForm" label-width="90px" inline 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="登录账号" prop="phoneNumber" >
			    <el-input v-model="dialogInfo.data.phoneNumber" placeholder="请输入手机号码" :maxlength="11"></el-input>
			  </el-form-item>
			  <el-form-item></el-form-item>
			  <el-form-item label="所属组织" prop="orgId">
			    <el-select v-model="dialogInfo.data.orgId" placeholder="请选择">
			      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="系统角色" prop="roleId">
			    <el-select v-model="dialogInfo.data.roleId" placeholder="请选择">
			      <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="真实姓名" prop="realName">
			  	<el-input v-model="dialogInfo.data.realName" :maxlength="10" ></el-input>
			  </el-form-item>
			  <el-form-item label="性别" prop="agentGender">
			  	<el-radio-group v-model="dialogInfo.data.agentGender">
			      <el-radio :label="1">男</el-radio>
    				<el-radio :label="2">女</el-radio>
			    </el-radio-group>
			  </el-form-item>
			  <el-form-item label="出生日期" prop="birthday">
			  	<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" v-model="dialogInfo.data.birthday"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="身份证号" prop="cardNo">
			  	<el-input v-model="dialogInfo.data.cardNo" :maxlength="18"></el-input>
			  </el-form-item>
			  <el-form-item label="入职时间" prop="entryTime">
			  	<el-date-picker type="date" value-format="yyyy-MM-dd" :editable="false" v-model="dialogInfo.data.entryTime"></el-date-picker>
			  </el-form-item>
			  <el-form-item label="基本工资" prop="basePay">
			  	<el-input v-model="dialogInfo.data.basePay" :maxlength="10"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'base-setting-user',
	data() {
		return {
			dateOption: {
				disabledDate(time) {
					return time.getTime() > Date.now()
				},
				shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
			},
			list: {
				filter: {
					realName: '',
					orgName: ''
				},
				rules: {
					realName: [],
					orgName: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增系统用户',
				visible: false,
				loading: false,
				rules: {
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' },
						{ pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
					],
					orgId: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					roleId: [
						{ required: true, type: 'number', message: '必选项', trigger: 'change' }
					],
					realName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					agentGender: [],
					birthday: [],
					entryTime: [],
					basePay: [
						{ pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					]
				},
				data: {
					phoneNumber: '',
					userId: '',
					orgId: '',
					roleId: '',
					realName: '',
					cardNo: '',
					agentGender: '',
					birthday: '',
					entryTime: '',
					basePay: ''
				}
			}
		}
	},
	computed: {
		...mapGetters([
  		'zuzhiList',
  		'roleList'
    ])
	},
	methods: {
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.user.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.doing = false
        	return item
        })
			}).finally(_ => {
				this.list.loading = false
			})
		},
		refreshList() {
			this.getList(this.list.page)
		},
		search() {
			this.getList()
		},
		clear() {
			this.$refs.listFilter && this.$refs.listFilter.resetFields()
			this.getList()
		},
		showDialogInfo(type = 'new', row) { // 新增/修改用户弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改系统用户'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增系统用户'
				this.resetDialogInfo()
			}

			const loading = this.$loading()
			Promise.all([
				this.$store.dispatch('getZuzhiList'),
				this.$store.dispatch('getRoleList')
			]).then(dataArr =>　{
				this.dialogInfo.visible = true	
			}).finally(_ => {
				loading.close()
			})
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.resetDialogInfo()
		},
		resetDialogInfo() {
			this.$refs.infoForm && this.$refs.infoForm.resetFields()
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交用户信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.user.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '用户信息成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }else {
        	this.$message({
						type: 'error',
						message: '请完善表单信息'
					})
        }
      })
		},
		enableAsk(row, status = 1) {
			if(status == 0){
				this.$confirm('是否确定禁用该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
        	this.enable(row, status)  
        })
			}else{
				this.enable(row, status)
			}
		},
		enable(row, status = 1) { // 禁用/启用用户
			row.doing = true
			this.$$api.user.enable(row.userId, status).then(_ => {
				row.isEnable = status
				this.$message({
					type: 'success',
					message: status === 1 ? '该用户启用成功' : '该用户禁用成功'
				})
			}).finally(_ => {
				row.doing = false
			})
		}
	},
	mounted() {
		this.$$event.$on('base-setting:tab', activeName => {
			if(activeName === 'user' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>