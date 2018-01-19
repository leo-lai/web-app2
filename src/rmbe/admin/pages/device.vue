<template>
	<div class="l-main-body">
		<el-row>
  		<el-col :span="4">
  			<el-button type="primary" @click="showDialogInfo('new')">生成设备</el-button>
  		</el-col>
  		<el-col :span="20" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent>
  				<el-form-item prop="number" lalel="">
				    <el-input placeholder="设备编号" v-model="list.filter.number"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="tel" lalel="">
				    <el-input placeholder="手机号码" v-model="list.filter.tel"></el-input>
				  </el-form-item>
				  <el-form-item style="width: 140px;" prop="related" label="">
				  	<el-select v-model="list.filter.related" placeholder="是否有设备" @change="search()">
				      <el-option label="是" :value="1"></el-option>
				      <el-option label="否" :value="0"></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="search">查询</el-button>
				    <el-button @click="clear">刷新</el-button>
				  </el-form-item>
				</el-form>
  		</el-col>
  	</el-row>
		<el-table class="l-table-hdbg" stripe element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中" 
  		:data="list.data" v-loading="list.loading">
	    <el-table-column label="设备编号" prop="number"></el-table-column>
	    <el-table-column label="属于商户" prop="name" align="center">
	    	<template slot-scope="scope">
	    		<span>{{ scope.row.seller_id ? scope.row.name : '无' }}</span>
	    	</template>
	    </el-table-column>
	    <el-table-column label="商家手机号" prop="tel" align="center"></el-table-column>
	    <el-table-column label="累计使用次数" prop="start_count" align="center"></el-table-column>
	    <el-table-column label="剩余使用次数" prop="remain_count" align="center"></el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
	    		<span v-show="scope.row.doing" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;操作中</span>
	        <span v-show="!scope.row.doing">
	        	<el-button v-if="scope.row.seller_id" class="l-text-link" type="text" size="small" @click="showDialogRelate(false, scope.row)">解除关联</el-button>
		    		<el-button v-else class="l-text-link" type="text" size="small" @click="showDialogRelate(true, scope.row)">关联商户</el-button>
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
	  	 	:page-size="list.row"
	  	 	:current-page="list.page"
	  	 	:total="list.total">
			</el-pagination>
	  </el-row>

	  <!-- 关联商家 -->
	  <el-dialog title="关联商家" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogRelate" :visible.sync="dialogRelate.visible" width="400px">
	  	<el-form inline ref="relateForm" class="l-form1" label-width="90px"
  			:model="dialogRelate.data" :rules="dialogRelate.rules" @keyup.enter.native="submitRelate">
			  <el-form-item label="商家手机号">
			    <el-input v-model="dialogRelate.data.tel" :maxlength="11" @blur="getBusinessInfo()"></el-input>
			    <span v-show="dialogRelate.searching" class="l-text-warn"><i class="el-icon-loading"></i>&nbsp;查询中...</span>
			  </el-form-item>
			  <el-form-item label="商家姓名">
			    <span>{{dialogRelate.data.name}}</span>
			  </el-form-item>
			  <el-form-item label="商家地址">
			    <span>{{dialogRelate.data.address}}</span>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogRelate()">取消</el-button>
		    <el-button type="primary" :loading="dialogRelate.loading" @click="submitRelate">确定提交</el-button>
		  </span>
	  </el-dialog>

	  <!-- 生成设备 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="400px">
  		<el-form inline ref="infoForm" class="l-form1" label-width="120px"
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @submit.native.prevent @keyup.enter.native="submitInfo">
			  <el-form-item label="生成设备个数" prop="count">
			    <el-input v-model.number="dialogInfo.data.count" :maxlength="10"></el-input>
			  </el-form-item>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitInfo">确定生成</el-button>
		  </span>
		</el-dialog>

		<!-- 地图选择 -->
		<amap-selector :visible.sync="amapOpts.visible" :options="amapOpts"></amap-selector>
	</div>
</template>
<script>
import AmapSelector from 'components/amap-selector'
import { getValueByText } from 'assets/js/region.data'

export default {
	name: 'business',
	components: {
		AmapSelector
	},
	data() {
		let that = this
		let validateRegion = function(rule, value, callback) {
      if (!(that.dialogInfo.data.region_id1 && that.dialogInfo.data.region_id2 
      	&& that.dialogInfo.data.region_id3 && that.dialogInfo.data.detail_address)){
        callback(new Error('请选择地址'))
      } else if(!that.dialogInfo.data.longitude || !that.dialogInfo.data.latitude){
        callback(new Error('经纬度不正确'))
      }else{
        callback()
      }
		}

		return {
			amapOpts: {
				visible: false,
				province: '',
        city: '',
        area: '',
        address: '',
        longitude: '',
        latitude: '',
				onSelected(addressObj) {
					let regionValue = getValueByText(addressObj.province, addressObj.city, addressObj.area)
					that.dialogInfo.data.region_id1 = regionValue[0] || ''
					that.dialogInfo.data.region_id2 = regionValue[1] || ''
					that.dialogInfo.data.region_id3 = regionValue[2] || ''
					
					// that.dialogInfo.data.province = addressObj.province
					// that.dialogInfo.data.city = addressObj.city
					// that.dialogInfo.data.area = addressObj.area
					that.dialogInfo.data.detail_address = addressObj.address
					that.dialogInfo.data.longitude = addressObj.longitude
					that.dialogInfo.data.latitude = addressObj.latitude
				}
			},
			list: {
				filter: {
					tel: '',
					numnber: '',
					related: ''
				},
				rules: {
					tel: [],
					numnber: [],
					related: []
				},
				loading: false,
				page: 1,
				row: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '生成设备',
				visible: false,
				loading: false,
				rules: {
					count: [
						{ required: true, type:'number',  message: '必填项', trigger: 'blur' }
					]
				},
				data: {
					count: ''
				}
			},
			dialogRelate: {
				visible: false,
				loading: false,
				searching: false,
				data: {
					related: true,
					seller_id: '',
					number: '',
					name: '',
					tel: '',
					address: ''
				}
			}
		}
	},
	computed: {
		amapAddress() {
			let address = this.amapOpts.city + this.amapOpts.area + this.dialogInfo.data.detail_address
			if(this.amapOpts.province !== this.amapOpts.city) {
				address = this.amapOpts.province + address 
			}
			return address || ''
		}
	},
	methods: {
		sizeChange(size = 100) {
			this.getList(1, size)
		},
		pageChange(page = 1) {
			this.getList(page)
		},
		getList(page = 1, row) {
			this.list.loading = true
			this.$$api.device.getList(this.list.filter, page, row)
			.then(({data}) => {
				this.list.total = data.count
        this.list.page = Number(data.page_number) + 1
        this.list.row = Number(data.per_page)
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
		showDialogInfo(type = 'new', row) { // 录入/更新商家
			this.dialogInfo.type = type
			if(type === 'edit') {
				
			} else {
				this.$$utils.copyObj(this.dialogInfo.data, '')
			}
			this.dialogInfo.visible = true	
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false	
			}
			this.$refs.infoForm.resetFields()	
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitInfo() { // 批量生成设备
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.device.add(this.dialogInfo.data.count).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: (this.dialogInfo.type === 'new' ? '生成' : '更新') + '设备成功'
						})
            this.refreshList()
          }).finally(()=>{
            this.dialogInfo.loading = false
          })  
        }
      })
		},
		showDialogRelate(related = true, row) { // 关联商家
			this.dialogRelate.data.related = related
			this.dialogRelate.data.number = row.number
			if(related) { // 关联
				this.dialogRelate.visible = true
			}else { // 解除关联
				this.$confirm('你确定要取消吗，取消后设备不可支付？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(_ => {
	      	row.doing = true
					this.submitRelate().finally(_ => {
						row.doing = false
					})
	      })
			}
		},
		closeDialogRelate(done) {
			if(done) {
				done()
			}else{
				this.dialogRelate.visible = false	
			}
			// this.$$utils.copyObj(this.dialogRelate.data, '')
		},
		submitRelate() {
			if(this.dialogRelate.data.related && !this.dialogRelate.data.seller_id) {
				this.$message.error('找不到商家关联')
				return
			}

			if(!this.dialogRelate.data.number) {
				this.$message.error('设备不存在')
				return
			}

			this.dialogRelate.loading = true
			return this.$$api.device.relate({
				number: this.dialogRelate.data.number,
				seller_id: this.dialogRelate.data.seller_id
			}, this.dialogRelate.data.related).then(_ => {
				this.closeDialogRelate()
				this.$message.success('该设备关联商家成功')
				this.refreshList()
			}).finally(_ => {
				this.dialogRelate.loading = false
			})
		},
		getBusinessInfo() { // 商家详情
			if(this.dialogRelate.data.tel) {
				this.dialogRelate.searching = true
				this.$$api.business.getInfo({
					tel: this.dialogRelate.data.tel
				}).then(({data}) => {
					this.dialogRelate.data.seller_id = data.uid
					this.dialogRelate.data.name = data.name
					this.dialogRelate.data.address = data.province + data.city + data.district + data.detail_address

				}).catch(_ => {
					this.dialogRelate.data.seller_id = ''
					this.dialogRelate.data.name = ''
					this.dialogRelate.data.address = ''
				}).finally(_ => {
					this.dialogRelate.searching = false
				})
			}else {
				this.dialogRelate.data.seller_id = ''
				this.dialogRelate.data.name = ''
				this.dialogRelate.data.address = ''
			}
		},
		deleteInfo(row) { // 删除
			this.$confirm('是否确定删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
      	row.doing = true
				this.$$api.device.del(row.number).then(_ => {
					this.$message({
						type: 'success',
						message: '删除设备成功'
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
