<template>
	<div>
		<el-row class="l-margin-b">
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增分组</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="分组名称" prop="groupingName" width="200"></el-table-column>
	    <el-table-column label="备注" prop="remarks"></el-table-column>
	    <el-table-column label="操作" width="300">
	    	<template slot-scope="scope">
					<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
						<el-button class="l-text-error" type="text" size="small" @click="delGroup(scope.row)">删除</el-button>
						<el-button class="l-text-link" type="text" size="small" @click="showDialogUserList(scope.row)">分配组内人员</el-button>
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

	  <!-- 新增/编辑分组 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="90px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="分组名称" prop="groupingName">
			    <el-input v-model="dialogInfo.data.groupingName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="备注信息" prop="remarks">
			  	<el-input type="textarea" v-model="dialogInfo.data.remarks" :maxlength="500"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<!-- 分配组内人员 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false"
			title="分配组内人员" :visible.sync="dialogUser.visible" width="600px">
			<div class="l-margin-b">提示：组内管理员可以查看成员数据，请合理分配。</div>
			<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" max-height="300" :data="dialogUser.userList">
				<el-table-column label="人员姓名" prop="userName"></el-table-column>
				<el-table-column label="组别角色" prop="overManage">
					<template slot-scope="scope">{{groupRole[scope.row.overManage]}}</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
						<span v-show="!scope.row.doing">
							<el-button class="l-text-link" type="text" size="small"  @click="showDialogUser('edit', scope.row)">编辑</el-button>
							<el-button class="l-text-error" type="text" size="small"  @click="delUser(scope.row)">移除</el-button>
						</span>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="l-margin-r-m">
		    <el-button type="primary" @click="showDialogUser('new')">添加人员</el-button>
		  </span>

			<!-- 添加人员 -->
		  <el-dialog class="l-padding-t-0" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body width="400px"
		  	:title="dialogUser.title" :visible.sync="dialogUser.innerVisible">
				<div class="l-margin-b">提示：组内管理员可以查看成员数据，请合理分配。</div>
		  	<el-form class="l-form1" label-width="90px" :model="dialogUser.data">
				  <el-form-item label="人员姓名" prop="userId">
				    <el-select filterable v-model="dialogUser.data.userId" placeholder="请选择">
				      <el-option :label="item.systemUserName" :value="item.systemUserId" v-for="item in dialogUser.sltUserList" :key="item.systemUserId"></el-option>
				    </el-select>
				  </el-form-item>
					<el-form-item label="组内角色" prop="overManage">
				    <el-select filterable v-model="dialogUser.data.overManage" placeholder="请选择">
				      <el-option :label="item" :value="index" v-for="(item,index) in groupRole" :key="index"></el-option>
				    </el-select>
				  </el-form-item>
				</el-form>
				<span slot="footer" class="l-margin-r-m">
					<el-button @click="dialogUser.innerVisible = false">取消</el-button>
			    <el-button type="primary" :loading="dialogUser.loading" @click="submitDialogUser">确定提交</el-button>
			  </span>
		  </el-dialog>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'base-setting-group',
	data() {
		return {
			groupRole: ['成员', '管理员'],
			list: {
				filter: {},
				rules: {},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增分组',
				visible: false,
				loading: false,
				rules: {
					groupingName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					remarks: []
				},
				data: {
					groupingId: '',
					groupingName: '',
					remarks: ''
				}
			},
			dialogUser: {
				title: '分配组内人员',
				visible: false,
				innerVisible: false,
				loading: false,
				userList: [],
				sltUserList: [],
				data: {
					groupingId: '',
					userGroupingId: '',
					userId: '',
					overManage: 0
				}
			}
		}
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
			this.$$api.group.getList(this.list.filter, page, rows)
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
		showDialogInfo(type = 'new', row) { // 新增/修改分组弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改分组'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增分组'
				this.resetDialogInfo()
			}
			this.dialogInfo.visible = true	
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
		submitDialogInfo() { // 提交分组信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.group.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '分组成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		delGroup(row) { // 删除分组
			this.$confirm('是否确定删除该分组?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(_ => {
				row.doing = true
				this.$$api.group.del(row.groupingId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
			})
		},
		getUserList() { // 组内人员
			return this.$$api.group.getUserList(this.dialogUser.data.groupingId).then(({data}) => {
				this.dialogUser.userList = data
				return data
			})
		},
		showDialogUserList(row) { // 
			const loading = this.$loading()
			this.dialogUser.data.groupingId = row.groupingId
			this.getUserList().then(data => {
				this.dialogUser.visible = true
			}).finally(_ => {
				loading.close()
			})
		},
		showDialogUser(type = 'new', row) { // 新增/修改分配人员
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改人员'
				this.$$utils.copyObj(this.dialogUser.data, row)
			} else {
				this.dialogInfo.title = '添加人员'
			}

			this.$$api.group.getSltUserList().then(({data}) => {
				this.dialogUser.sltUserList = data
			}).finally(_ => {
				this.dialogUser.innerVisible = true
			})
		},
		submitDialogUser() {
			if(!this.dialogUser.data.userId) {
				this.$message.error('请选择添加人员')
				return
			}
			if(!this.dialogUser.data.userId) {
				this.$message.error('请选择组内角色')
				return
			}
			
			this.dialogUser.loading = true
			this.$$api.group.addUser(this.dialogUser.data).then(_ => {
				this.dialogUser.data.userId = ''
				this.dialogUser.data.userGroupingId = ''
				this.dialogUser.innerVisible = false
				this.getUserList()
			}).finally(_ => {
				this.dialogUser.loading = false
			})
		},
		delUser(row) { // 删除组内人员
			row.doing = true
			this.$$api.group.delUser(row.userGroupingId).then(_ => {
				this.$message.success('移除成功')
				this.getUserList()
			}).finally(_ => {
				row.doing = false
			})
		}
	},
	mounted() {
		this.$$event.$on('base-setting:tab', activeName => {
			if(activeName === 'group' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>