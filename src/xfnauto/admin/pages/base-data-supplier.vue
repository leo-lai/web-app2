<template>
	<div>
		<el-row>
  		<el-col :span="8">
  			<el-button type="primary" @click="showDialogInfo('new')">新增</el-button>
  		</el-col>
  		<el-col :span="16" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="orgName">
				    <el-input placeholder="请输入门店/公司名称" v-model="list.filter.orgName"></el-input>
				  </el-form-item>
				  <el-form-item prop="supplierName">
				    <el-input placeholder="请输入供应商名称" v-model="list.filter.supplierName"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button type="danger" @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
  	<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="供应商名称" prop="supplierName"></el-table-column>
	    <el-table-column label="服务公司" prop="orgName"></el-table-column>
	    <el-table-column label="联系方式" prop="phoneNumber"></el-table-column>
	    <el-table-column label="备注" prop="remark" min-width="200"></el-table-column>
	    <el-table-column label="操作">
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

	  <!-- 新增/编辑供应商 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="100px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item class="_flex" label="供应商名称" prop="supplierName" >
			    <el-input v-model="dialogInfo.data.supplierName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="联系方式" prop="phoneNumber" >
			    <el-input v-model="dialogInfo.data.phoneNumber" :maxlength="20"></el-input>
			  </el-form-item>
			  <el-form-item label="备注" prop="remark">
			  	<el-input type="textarea" v-model="dialogInfo.data.remark" :maxlength="500"></el-input>
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
export default {
	name: 'base-data-supplier',
	data() {
		return {
			list: {
				filter: {
					supplierName: '',
					orgName: ''
				},
				rules: {
					supplierName: [],
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
				title: '新增供应商',
				visible: false,
				loading: false,
				rules: {
					supplierName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					phoneNumber: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					orgId: [
						{ required: true, type: 'number', message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					supplierId: '',
					supplierName: '',
					phoneNumber: '',
					remark: ''
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
			this.$$api.supplier.getList(this.list.filter, page, rows)
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
		showDialogInfo(type = 'new', row) { // 新增/修改供应商弹出信息
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改供应商'
				this.$$utils.copyObj(this.dialogInfo.data, row)
			} else {
				this.dialogInfo.title = '新增供应商'
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
		submitDialogInfo() { // 提交供应商
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.supplier.add(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '新增' : '修改') + '供应商成功'
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
		deleteInfo(row) { // 禁用/启用供应商
			this.$confirm('是否确定删除该供应商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.supplier.del(row.supplierId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除供应商成功'
					})
					this.refreshList()
				}).finally(_ => {
					row.doing = false
				})
      })
		}
	},
	mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'supplier' && this.list.data.length === 0) {
				this.getList()
			}
		})
	}
}
</script>