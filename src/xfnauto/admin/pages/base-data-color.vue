<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent >
				  <el-form-item prop="brandId">
				  	<el-select filterable v-model="list.filter.brandId" placeholder="请选择车辆品牌" @change="search()">
				      <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				    </el-select>
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
	    <el-table-column label="车系名称" prop="carFamilyName"></el-table-column>
	    <el-table-column label="操作" >
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogCheshen(scope.row)">车身颜色</el-button>
	        <el-button class="l-text-warn" type="text" size="small" @click="showDialogNeishi(scope.row)">内饰颜色</el-button>
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

	  <!-- 车身颜色管理 -->
		<el-dialog :close-on-press-escape="false" 
			title="车身颜色管理" :visible.sync="dialogCheshen.visible" width="600px">
			<div style="margin: -20px 0 10px;">
				<span>当前车系：</span>
				<span class="l-text-gray">{{dialogCheshen.familyName}}</span>
			</div>
			<div ref="cheshenScroll" class="l-scroll" style="max-height: 400px; ">
	  		<el-table class="l-table-hdbg" :data="dialogCheshen.list" @cell-dblclick="cheshenColorEdit">
			    <el-table-column label="车身颜色" prop="carColourName" min-width="150">
			    	<template slot-scope="scope">
			        <input :ref="'coloript-' + scope.row.carColourId" class="_editipt" placeholder="请输入颜色名称" 
			        	v-model="scope.row.carColourName" maxlength="50"
			        	:disabled="!scope.row.editing" :autofocus="scope.row.editing"
			        	@change="cheshenColorSave(scope.row)" @blur="cheshenColorBlur(scope.row)">
			      </template>
			    </el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
			        <span v-show="scope.row.loading" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
			        <span v-show="!scope.row.loading">
			        	<el-button v-if="!scope.row.editing" class="l-text-link" type="text" size="small" @click="cheshenColorEdit(scope.row)">编辑</el-button>
			        	<el-button v-else type="primary" size="mini" @click="cheshenColorSave(scope.row)">保存</el-button>
			        	<el-button class="l-text-error" type="text" size="small" @click="cheshenColorDel(scope.row)">删除</el-button>
			        </span>
			      </template>
			    </el-table-column>
			  </el-table>
		  </div>
			<span slot="footer" class="l-margin-r-m">
		    <el-button type="primary" :loading="dialogCheshen.loading" @click="cheshenColorNew()">新增车身颜色</el-button>
		  </span>
		</el-dialog>

		<!-- 内饰颜色管理 -->
		<el-dialog :close-on-press-escape="false" 
			title="内饰颜色管理" :visible.sync="dialogNeishi.visible" width="600px">
			<div style="margin: -20px 0 10px;">
				<span>当前车系：</span>
				<span class="l-text-gray">{{dialogNeishi.familyName}}</span>
			</div>
			<div ref="neishiScroll" class="l-scroll" style="max-height: 400px; ">
	  		<el-table class="l-table-hdbg" :data="dialogNeishi.list" @cell-dblclick="neishiColorEdit">
			    <el-table-column label="内饰颜色" prop="interiorName" min-width="150">
			    	<template slot-scope="scope">
			        <input :ref="'neishiipt-' + scope.row.interiorId" class="_editipt" placeholder="请输入颜色名称" 
			        	v-model="scope.row.interiorName" maxlength="50"
			        	:disabled="!scope.row.editing" :autofocus="scope.row.editing"
			        	@change="neishiColorSave(scope.row)" @blur="neishiColorBlur(scope.row)">
			      </template>
			    </el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
			        <span v-show="scope.row.loading" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
			        <span v-show="!scope.row.loading">
			        	<el-button v-if="!scope.row.editing" class="l-text-link" type="text" size="small" @click="neishiColorEdit(scope.row)">编辑</el-button>
			        	<el-button v-else type="primary" size="mini" @click="neishiColorSave(scope.row)">保存</el-button>
			        	<el-button class="l-text-error" type="text" size="small" @click="neishiColorDel(scope.row)">删除</el-button>
			        </span>
			      </template>
			    </el-table-column>
			  </el-table>
		  </div>
			<span slot="footer" class="l-margin-r-m">
		    <el-button type="primary" :loading="dialogNeishi.loading" @click="neishiColorNew()">新增内饰颜色</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'base-data-color',
	data() {
		return {
			brandList: [],
			list: {
				filter: {
					brandId: ''
				},
				rules: {
					brandId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogCheshen: {
				visible: false,
				loading: false,
				familyId: '',
				familyName: '',
				list: [],
				data: {
					familyId: '',
					carColourId: '',
					carColourName: ''
				}
			},
			dialogNeishi: {
				visible: false,
				loading: false,
				familyId: '',
				familyName: '',
				list: [],
				data: {
					familyId: '',
					interiorId: '',
					interiorName: ''
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
			this.$$api.color.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list
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

		// 车身=============================================
		showDialogCheshen(row) { // 车身颜色弹窗管理
			const loading = this.$loading()
			this.dialogCheshen.familyId = row.carFamilyId
			this.dialogCheshen.familyName = row.carFamilyName
			this.getCheshenColors(row.carFamilyId).then(_ => {
        this.dialogCheshen.visible = true	
			}).finally(_ => {
				loading.close()
			})
		},
		getCheshenColors(carFamilyId = '') { // 获取车身颜色列表
			return this.$$api.color.getCheshenList(carFamilyId).then(({data}) => {
				this.dialogCheshen.list = data.map(item => {
        	item.loading = false
        	item.editing = false
        	item.isNew = false
        	return item
        })
        return data
			})
		},
		cheshenColorBlur(row) {
			if(row.isNew && !row.carColourId && !row.carColourName) {
				this.dialogCheshen.list.pop()
				return
			}else if(!row.loading){
				row.editing = false
			}
		},
		cheshenColorEdit(row, column, cell, event) {
			if(column && column.property !== 'carColourName') return
			row.editing = true
			setTimeout(_ => {
				this.$refs['coloript-' + row.carColourId].focus()	
			}, 50)
		},
		cheshenColorSave(row) {
			if(row.loading) return
			
			if(!row.carColourName) {
				this.$message({
					type: 'error',
					message: '请输入颜色名称'
				})
				this.$refs['coloript-' + row.carColourId].focus()	
				return
			}

			row.loading = true
			this.$$utils.copyObj(this.dialogCheshen.data, row)
			this.$$api.color.addCheshen(this.dialogCheshen.data).then(({data}) => {
				row.isNew = false
				row.editing = false
				this.$message({
					type: 'success',
					message: row.carColourId ? '修改车身颜色成功' : '新增车身颜色成功'
				})
				row.carColourId = data.carColourId
      }).finally(_ => {
      	setTimeout(_ => {
        	row.loading = false
      	}, 500)
      })
		},
		cheshenColorDel(row) {
			if(!row.carColourId) {
				this.dialogCheshen.list.pop()
				return
			}

			this.$confirm('是否确定删除该颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
	      row.loading = true
				this.$$api.color.delCheshen(row.carColourId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除车身颜色成功'
					})
					this.getCheshenColors(this.dialogCheshen.familyId)
				}).finally(_ => {
					row.loading = false
				})
      })
		},
		cheshenColorNew() {
			if(this.dialogCheshen.list.length > 0 && this.dialogCheshen.list[this.dialogCheshen.list.length - 1].isNew) {
				this.$refs.cheshenScroll.scrollTop = this.$refs.cheshenScroll.scrollHeight
				this.$refs['coloript-'] && this.$refs['coloript-'].focus()
				return
			}
			this.dialogCheshen.list.push({
				familyId: this.dialogCheshen.familyId,
				carColourId: '',
				carColourName: '',
				loading: false,
				editing: true,
				isNew: true
			})
			this.$refs.cheshenScroll.scrollTop = this.$refs.cheshenScroll.scrollHeight
			setTimeout(_ => {
				this.$refs['coloript-'] && this.$refs['coloript-'].focus()
			}, 50)
		},

		// 内饰=============================================
		showDialogNeishi(row) { // 内饰颜色弹窗管理
			const loading = this.$loading()
			this.dialogNeishi.familyId = row.carFamilyId
			this.dialogNeishi.familyName = row.carFamilyName
			this.getNeishiColors(row.carFamilyId).then(_ => {
        this.dialogNeishi.visible = true	
			}).finally(_ => {
				loading.close()
			})
		},
		getNeishiColors(carFamilyId = '') { // 获取内饰颜色列表
			return this.$$api.color.getNeishiList(carFamilyId).then(({data}) => {
				this.dialogNeishi.list = data.map(item => {
        	item.loading = false
        	item.editing = false
        	item.isNew = false
        	return item
        })
        return data
			})
		},
		neishiColorBlur(row) {
			if(row.isNew && !row.interiorId && !row.interiorName) {
				this.dialogNeishi.list.pop()
				return
			}else if(!row.loading){
				row.editing = false
			}
		},
		neishiColorEdit(row, column, cell, event) {
			if(column && column.property !== 'interiorName') return
			row.editing = true
			setTimeout(_ => {
				this.$refs['neishiipt-' + row.interiorId].focus()	
			}, 50)
		},
		neishiColorSave(row) {
			if(row.loading) return
			
			if(!row.interiorName) {
				this.$message({
					type: 'error',
					message: '请输入颜色名称'
				})
				this.$refs['neishiipt-' + row.interiorId].focus()	
				return
			}

			row.loading = true
			this.$$utils.copyObj(this.dialogNeishi.data, row)
			this.$$api.color.addNeishi(this.dialogNeishi.data).then(({data}) => {
				row.isNew = false
				row.editing = false
				this.$message({
					type: 'success',
					message: row.interiorId ? '修改内饰颜色成功' : '新增内饰颜色成功'
				})
				row.interiorId = data.interiorId
      }).finally(_ => {
      	setTimeout(_ => {
        	row.loading = false
      	}, 500)
      })
		},
		neishiColorDel(row) {
			if(!row.interiorId) {
				this.dialogNeishi.list.pop()
				return
			}

			this.$confirm('是否确定删除该颜色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
	      row.loading = true
				this.$$api.color.delNeishi(row.interiorId).then(_ => {
					this.$message({
						type: 'success',
						message: '删除内饰颜色成功'
					})
					this.getNeishiColors(this.dialogNeishi.familyId)
				}).finally(_ => {
					row.loading = false
				})
      })
		},
		neishiColorNew() {
			if(this.dialogNeishi.list.length > 0 && this.dialogNeishi.list[this.dialogNeishi.list.length - 1].isNew) {
				this.$refs.neishiScroll.scrollTop = this.$refs.neishiScroll.scrollHeight
				this.$refs['neishiipt-'] && this.$refs['neishiipt-'].focus()
				return
			}
			this.dialogNeishi.list.push({
				familyId: this.dialogNeishi.familyId,
				interiorId: '',
				interiorName: '',
				loading: false,
				editing: true,
				isNew: true
			})
			this.$refs.neishiScroll.scrollTop = this.$refs.neishiScroll.scrollHeight
			setTimeout(_ => {
				this.$refs['neishiipt-'] && this.$refs['neishiipt-'].focus()
			}, 50)
		}
		
	},
	mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'color' && this.list.data.length === 0) {
				this.getList()
				this.$$api.car.getBrandList().then(({data}) => {
					this.brandList = data
				})
			}
		})
	}
}
</script>