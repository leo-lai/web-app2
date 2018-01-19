<template>
	<div>
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
  				<el-form-item prop="orgId">
  					<el-select v-model="list.filter.orgId" placeholder="请选择公司/门店" @change="search()">
				      <el-option v-for="item in zuzhiList" :key="item.orgId" :label="item.shortName" :value="item.orgId"></el-option>
				    </el-select>
  				</el-form-item>
				  <el-form-item prop="carsName">
				  	<el-input v-model="list.filter.carsName" placeholder="请输入车辆型号"></el-input>
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
	    <el-table-column class-name="l-fs-xs" label="车辆型号" prop="carsName" min-width="200"></el-table-column>
	    <el-table-column label="车身颜色" prop="colourName" align="center"></el-table-column>
	    <el-table-column label="内饰颜色" prop="interiorName" align="center"></el-table-column>
	    <el-table-column label="指导价格" prop="guidingPrice" align="center"></el-table-column>
	    <el-table-column label="库存数量" prop="number" align="center"></el-table-column>
	    <el-table-column label="优惠金额" prop="discountPrice" align="center"></el-table-column>
	    <el-table-column label="门店/公司名称" prop="orgName" align="center" min-width="120"></el-table-column>
	    <el-table-column label="线上展示" prop="isOnLine" align="center">
	    	<template slot-scope="scope">
	    		<span v-if="!scope.row.isOnLine" class="l-text-error">否</span>
	    		<span v-else>是</span>
	      </template>
	    </el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
	    		<el-button class="l-text-link" type="text" size="small" @click="showDialogInfo('edit', scope.row)">查看 / 编辑</el-button>
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

	  <!-- 车辆库存详情 -->
		<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDialogInfo"
			:title="dialogInfo.title" :visible.sync="dialogInfo.visible" width="873px">
  		<el-form ref="infoForm" inline class="l-form1" label-width="100px" 
  			:model="dialogInfo.data" :rules="dialogInfo.rules" @keyup.enter.native="submitDialogInfo">
			  <el-form-item class="_flex" label="车辆型号" style="width: 622px;">
			    <el-input disabled v-model="dialogInfo.data.carsName"></el-input>
			  </el-form-item>
			  <el-form-item label="指导价" >
			  	<el-input disabled v-model="dialogInfo.data.guidingPrice"></el-input>
			  </el-form-item>
			  <el-form-item label="发票金额" prop="invoicePrice">
			  	<el-input v-model="dialogInfo.data.invoicePrice" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item label="定金/辆" prop="depositPrice">
			  	<el-input v-model="dialogInfo.data.depositPrice"></el-input>
			  </el-form-item>
			  <el-form-item label="优惠" prop="discountPrice">
			  	<el-input v-model="dialogInfo.data.discountPrice" :maxlength="10"></el-input>
			  </el-form-item>
			  <el-form-item class="_flex" label="是否线上展示">
			  	<el-switch v-model="dialogInfo.data.isOnLine" active-text="是" inactive-text="否"></el-switch>
			  	<el-tooltip content="关闭线上展示则客户预定该车型时，不推荐客户来您门店了解和试驾" placement="right">
            <i style="vertical-align: middle;" class="el-icon-question"></i>
          </el-tooltip>
			  </el-form-item>
			  <el-table class="l-table-hdbg" stripe :data="dialogInfo.list">
			    <el-table-column label="车架号" prop="frameNumber"></el-table-column>
			    <el-table-column label="发动机号" prop="engineNumber"  align="center"></el-table-column>
			    <el-table-column label="票证号" prop="certificateNumber"  align="center"></el-table-column>
			    <el-table-column label="仓位" prop="warehouseName"  align="center"></el-table-column>
			    <el-table-column label="入库时间" prop="createDate"  align="center" class-name="l-fs-xs" min-width="120"></el-table-column>
			    <el-table-column label="操作" align="center">
			    	<template slot-scope="scope">
			        <el-button :class="scope.row.imagesArr ? 'l-text-link' : 'l-text-gary'" type="text" size="small" @click="showCarImages(scope.row.imagesArr)">查看验车照片</el-button>
			      </template>
			    </el-table-column>
			  </el-table>
			</el-form>
			<span slot="footer" class="l-margin-r-m">
				<el-button @click="closeDialogInfo()">取消</el-button>
		    <el-button type="primary" :loading="dialogInfo.loading" @click="submitDialogInfo">确定提交</el-button>
		  </span>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import viewerImages from 'components/viewer-images'
export default {
	name: 'stock-list',
	components: {
		viewerImages
	},
	data() {
		return {
			dateOptions: {
				shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
			},
			list: {
				filter: {
					carsName: '',
					orgId: ''
				},
				rules: {
					carsName: [],
					orgId: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			dialogInfo: {
				type: 'new',
				title: '查看/编辑库存信息',
				visible: false,
				loading: false,
				rules: {
					depositPrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					discountPrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					],
					invoicePrice: [
						{ required: true, pattern: /^\d{1,9}(\.\d{1,2})?$/, message: '必填项，正确格式(如：10.24)', trigger: 'blur' }
					]
				},
				data: {
					carsId: '',
					colourId: '',
					interiorId: '',
					carsName: '',
					guidingPrice: '',
					isOnLine: true,
					depositPrice: '',
					discountPrice: '',
					invoicePrice: ''
				},
				list: []
			}
		}
	},
	computed: {
		...mapGetters([
  		'zuzhiList'
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
			this.$$api.stock.getList(this.list.filter, page, rows)
			.then(({data}) => {
				this.list.total = data.total
        this.list.page = data.page
        this.list.rows = data.rows
        this.list.data = data.list.map(item => {
        	item.deling = false
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
		showDialogInfo(type = 'edit', row) { // 查看/编辑库存详情
			this.dialogInfo.type = type
			let { carsId, colourId, interiorId } = row
			this.$$utils.copyObj(this.dialogInfo.data, row)
			const loading = this.$loading()
			this.$$api.stock.getInfo({ carsId, colourId, interiorId }).then(({data}) => {
				this.dialogInfo.list = data.map(item => {
					if(item.stockCarImages) {
						item.imagesArr = item.stockCarImages.split(',').map(img => {
							return {
								url: this.$$utils.image.thumb(img, 150), 
								thumb: this.$$utils.image.thumb(img, 150), 
								src: img, 
								name: img, 
								status: 'success'
							}
						})
					}
					return item
				})
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
			this.$refs.infoForm.resetFields()
			this.$$utils.copyObj(this.dialogInfo.data, '')
		},
		submitDialogInfo() { // 提交库存信息
			this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.dialogInfo.loading = true
          this.$$api.stock.editInfo(this.dialogInfo.data).then(_ => {
            this.closeDialogInfo()
            this.$message({
							type: 'success',
							message: '编辑库存信息成功'
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
		showCarImages(imagesArr = []) { // 查看验车图片
			if(imagesArr && imagesArr.length > 0) {
				this.$refs.viewer.show(0, imagesArr)
			}else{
				this.$message.info('没有可查看图片')
			}
		}
	},
	mounted() {
		this.$$event.$on('stock:tab', (activeName, that) => {
			if(activeName === 'list' && this.list.data.length === 0) {
				this.$$parent = that
				this.getList()
				this.$store.dispatch('getZuzhiList')
			}
		})
	}
}
</script>