<template>
	<div class="l-main-body">
		<el-row class="l-margin-b">
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增角色</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="姓名" prop="name" min-width="150"></el-table-column>
	    <el-table-column label="账号" prop="username" min-width="150"></el-table-column>
	    <el-table-column label="密码" prop="password" min-width="150"></el-table-column>
	    <el-table-column label="权限集" prop="operations" min-width="140">
	    	<template slot-scope="scope">
	    		<el-popover trigger="hover" placement="bottom">
	    			<ul v-if="scope.row.operations && scope.row.operations.length > 0" class="l-permission-list">
	    				<li v-for="item in scope.row.operations">{{item.operation_name}}</li>
	    			</ul>
	    			<div v-else class="l-text-center l-text-gray">无任何权限</div>
	          <div slot="reference">
	            <el-tag size="medium">查看权限</el-tag>
	          </div>
	        </el-popover>
	    	</template>
	    </el-table-column>
	    <el-table-column label="所属地区" prop="region" min-width="200">
	    	<template slot-scope="scope">
	    		<span>{{scope.row.province + scope.row.city + scope.row.district}}</span>
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作" align="center" min-width="120">
	    	<template slot-scope="scope">
	    		<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">编辑</el-button>
	        	<el-button class="l-text-error" type="text" size="small" @click="deleteInfo(scope.row)">删除</el-button>
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

	  <!-- 新增/编辑角色 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="653px">
			<div class="l-scroll" style="max-height:400px;">
	  		<el-form class="l-form1" ref="infoForm" label-width="80px" inline
	  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitInfo">
				  <el-form-item label="账号" prop="username">
				    <el-input :disabled="dialogInfo.type === 'edit'" v-model="dialogInfo.data.username" :maxlength="50"></el-input>
				  </el-form-item>
				  <el-form-item label="姓名" prop="name">
				    <el-input v-model="dialogInfo.data.name" :maxlength="50"></el-input>
				  </el-form-item>
				  <el-form-item label="密码" prop="password">
				    <el-input v-model="dialogInfo.data.password" :maxlength="50"></el-input>
				  </el-form-item>
				  <el-form-item label="地区" prop="region">
				  	<el-cascader ref="region" style="width:100%;" change-on-select filterable v-model="dialogInfo.region" :options="regionData" :props="{label: 'text', value: 'value'}"></el-cascader>
				  </el-form-item>
				  <el-form-item class="_flex" label="权限" prop="permission">
				    <el-checkbox-group class="l-permission" v-model="dialogInfo.permission.value">
					    <el-checkbox v-for="item in dialogInfo.permission.data" :label="item.id" :key="item.id">
					    	{{item.name}}
					   	</el-checkbox>
					  </el-checkbox-group>
				  </el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定提交</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
import regionData from 'assets/js/region.data'
export default {
	data() {
		let that = this
		let validateRegion = function(rule, value, callback) {
      if (that.dialogInfo.region.length === 0) {
        callback(new Error('请选择地区'))
      }else{
      	that.dialogInfo.data.region_id1 = that.dialogInfo.region[0] || ''
      	that.dialogInfo.data.region_id2 = that.dialogInfo.region[1] || ''
      	that.dialogInfo.data.region_id3 = that.dialogInfo.region[2] || ''

      	that.dialogInfo.data.province = that.$refs.region.currentLabels[0] || ''
        that.dialogInfo.data.city = that.$refs.region.currentLabels[1] || ''
        that.dialogInfo.data.district = that.$refs.region.currentLabels[2] || ''
        callback()
      }
		}

		let validatePermission = function(rule, value, callback) {
      if (that.dialogInfo.permission.value.length === 0) {
        callback(new Error('请选择权限'))
      }else{
      	that.dialogInfo.data.operation_ids = that.dialogInfo.permission.value.join(',')
        callback()
      }
		}
		return {
			regionData,
			list: {
				filter: {
				},
				rules: {
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '新增角色',
				visible: false,
				loading: false,
				permission: {
					value: [],
					data: []					
				},
				region: [],
				rules: {
					name: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					region: [
						{ required: true, validator: validateRegion, trigger: 'change' }
					],
					permission: [
						{ required: true, validator: validatePermission, trigger: 'change' }
					]
				},
				data: {
					user_id: '',
					username: '',
					password: '',
					name: '',
					region_id1: '',
					region_id2: '',
					region_id3: '',
					province: '',
					city: '',
					district: '',
					operation_ids: ''
				}
			}
		}
	},
	methods: {
		formatOperations(row, column, cellValue) {
			if(cellValue && cellValue.length > 0) {
				return cellValue.map(item => item.operation_name).join('，')
			}else {
				return ''
			}

		},
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, rows) {
			this.list.loading = true
			this.$$api.sys.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.rows = Number(data.per_page)
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
		showDialogInfo(type = 'new', row) { // 新增/修改角色弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改角色'
				this.$$utils.copyObj(this.dialogInfo.data, row)
				this.dialogInfo.data.user_id = row.user_id ? row.user_id : row.uid
				this.dialogInfo.region = [row.region_id1 + '', row.region_id2 + '', row.region_id3 + '']
				this.dialogInfo.permission.value = row.operations ? row.operations.map(item => item.operation_id) : []
			} else {
				this.dialogInfo.title = '新增角色'
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}

			const loading = this.$loading()
			this.$$api.sys.getPermission().then(({data}) => {
				this.dialogInfo.permission.data = data
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
			this.$$utils.copyObj(this.dialogInfo.data, '')
			this.dialogInfo.region = []
			this.dialogInfo.permission.value = []
			this.$refs.infoForm.resetFields()	
		},
		submitInfo() { // 提交角色信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.sys.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '角色成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		deleteInfo(row) { // 删除
			this.$confirm('是否确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.sys.del(row.uid).then(_ => {
					this.$message({
						type: 'success',
						message: '删除角色成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		}
	},
	mounted() {
		this.getList()
	}
}
</script>
<style scoped lang="less">
.l-permission .el-checkbox{margin:0 10px 0 0; min-width: 160px;}
.l-permission-list{
	overflow: hidden; margin:10px 0; padding:0 0 0 40px; width: 340px; 
	li{ float: left; width: 140px; margin: 5px 0;}
	li:nth-child(even){margin-left: 40px;}
}
</style>