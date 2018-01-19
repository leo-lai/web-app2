<template>
  <div class="l-basedata-menu-box">
  	<div class="l-flex-hc _tit">
  		<b>菜单名称</b>
  		<div class="l-rest l-text-center">
  			<span v-if="loading" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;加载中...</span>
  		</div>
  		<el-button :disabled="loading" type="text" @click="showDialogInfo('new')">添加一级菜单</el-button>
  	</div>
    <el-tree v-if="menuList.length > 0" ref="menuTree" class="l-basedata-menu" highlight-current node-key="menuId" 
    	:data="menuList" :props="menuProps" :render-content="renderContent">
		</el-tree>

		<!-- 新增/编辑菜单 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="480px">
  		<el-form ref="infoForm" label-width="90px" style="width: 432px;"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item label="菜单名称" prop="menuName">
			    <el-input v-model="dialogInfo.data.menuName" :maxlength="50"></el-input>
			  </el-form-item>
			  <el-form-item label="菜单URL" prop="src">
			  	<el-input v-model="dialogInfo.data.src" :maxlength="50"></el-input>
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
function preventClick(e) {
	e.stopPropagation()
	return false
}
export default {
  name: 'base-data-menu',
  data() {
    return {
    	loading: false,
    	menuList: [],
      menuProps: {
        children: 'children',
        label: 'menuName'
      },
			dialogInfo: {
				type: 'new',
				title: '新增菜单',
				visible: false,
				loading: false,
				rules: {
					menuName: [
						{ required: true, message: '必填项', trigger: 'blur' }
					],
					src: [
						{ required: true, message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					parentId: 0,
					menuId: '',
					menuName: '',
					src: ''
				}
			}
    }
  },
  methods: {
  	getList() {
  		this.loading = true
			this.$$api.role.getMenuList().then(({data}) => {
				this.menuList = data
			}).finally(_ => {
				this.loading = false
			})
  	},
		showDialogInfo(type = 'new', data) { // 新增/修改菜单
			this.dialogInfo._data = data
			this.dialogInfo.type = type
			if(type === 'edit') {
				this.dialogInfo.title = '修改菜单'
				this.$$utils.copyObj(this.dialogInfo.data, data)
			} else {
				this.dialogInfo.title = '新增菜单'
				this.resetDialogInfo()
				this.dialogInfo.data.parentId = data ? data.menuId : 0
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
		submitDialogInfo() { // 提交菜单信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.menu.add(this.dialogInfo.data).then(({data}, message) => {
						this.dialogInfo.data.menuId = data.menuId || this.dialogInfo.data.menuId || Date.now()
						if(this.dialogInfo.type === 'new') {
							message = '新增菜单成功'
							let newChild = Object.assign({ children: [] }, this.dialogInfo.data)
							if(this.dialogInfo._data) {
								this.dialogInfo._data.children.unshift(newChild)	
							}else {
								this.menuList.unshift(newChild)
							}
							this.$refs.menuTree.setCurrentKey(newChild.menuId)
						}else {
							message = '修改菜单成功'
							this.dialogInfo._data.menuName = this.dialogInfo.data.menuName
							this.dialogInfo._data.src = this.dialogInfo.data.src
							this.$refs.menuTree.setCurrentKey(this.dialogInfo.data.menuId)
							console.log(this.$refs.menuTree)
						}

						this.$message.success(message)
						this.closeDialogInfo()
						
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		deleteInfo(node, data) { // 删除菜单
			this.$confirm('是否确定删除该菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
				this.$$api.menu.del(data.menuId).then(_ => {
					this.$message.success('删除菜单成功')

					const parent = node.parent
		      const children = parent.data.children || parent.data
		      const index = children.findIndex(menu => menu.menuId === data.menuId)
		      children.splice(index, 1)

				})
      })
		},
    renderContent(h, { node, data, store }) {
      return (
        <div style="flex:1;" class="l-flex-hc">
          <span class="l-rest">
            <span>{data.menuName}</span>
          </span>
          <span class="l-padding-r" onClick={ preventClick }>
            <el-button class="l-text-link" type="text" onClick={ _ => this.showDialogInfo('edit', data) }>编辑</el-button>
            <el-button class="l-text-error" type="text" onClick={ _ => this.deleteInfo(node, data) }>删除</el-button>
            <el-button class="l-text-link" type="text" onClick={ _ => this.showDialogInfo('new', data) }>添加子菜单</el-button>
          </span>
        </div>
      )
    }
  },
  mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'menu' && this.menuList.length === 0) {
				this.getList()
			}
		})
  }
}
</script>
<style scoped lang="less">
.l-basedata-menu-box{
	width: 700px;
	._tit{ background: #efeff4; padding: 0.25rem 0.75rem; }
}
</style>