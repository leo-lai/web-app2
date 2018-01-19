<template>
	<div class="l-main-body l-bg-white">
		<el-row>
  		<el-col :span="24" class="l-text-right">
  			<el-form inline ref="listFilter" :model="list.filter" :rules="list.rules" @submit.native.prevent @keyup.enter.native="search">
				  <el-form-item prop="customerPhoneNumber">
				    <el-select filterable v-model="list.filter.isPassThrough" placeholder="请选择审核状态" @change="search()">
				      <el-option label="通过" :value="1"></el-option>
				      <el-option label="不通过" :value="0"></el-option>
				    </el-select>
				  </el-form-item>
				  <el-form-item prop="customerPhoneNumber">
				    <el-input placeholder="请输入客户手机号码" :maxlength="11" v-model="list.filter.customerPhoneNumber"></el-input>
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
	    <el-table-column label="客户手机" prop="customerPhoneNumber"></el-table-column>
	    <el-table-column label="客户姓名" prop="customerName"></el-table-column>
	    <el-table-column label="门店名称" prop="orgName"></el-table-column>
	    <el-table-column label="贷款金额" prop="loan" align="center"></el-table-column>
	    <el-table-column label="还款期数" prop="loanPayBackStages" align="center"></el-table-column>
	    <el-table-column label="车辆是否抵押" prop="isMortgage" align="center">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.isMortgage == 1">抵押</span>
	    		<span v-else>不抵押</span>
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="提交时间" prop="createDate" align="center" min-width="120"></el-table-column>
	    <el-table-column label="审批状态" prop="auditStatus" align="center">
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.auditStatus == 0">待审批</span>
	    		<div class="l-text-success" v-else-if="scope.row.auditStatus === 1">通过</div>
	    		<span class="l-text-error" v-else-if="scope.row.auditStatus === 2">不通过</span>
	    	</template>
	    </el-table-column>
	    <el-table-column class-name="l-fs-xs" label="审批时间" prop="auditTime" align="center" min-width="120"></el-table-column>
	    <el-table-column label="操作" align="center">
	    	<template slot-scope="scope">
	        <el-button class="l-text-link" type="text" size="small" @click="showDialogInfo(scope.row)">查看资料</el-button>
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

	  <!-- 查看资料 -->
		<el-dialog class="l-padding-t-0" :close-on-click-modal="false"
			:before-close="closeDialogInfo" :visible.sync="dialogInfo.visible" width="470px">
			<div class="l-flex-hc" slot="title">
				<span style="line-height: 24px; font-size: 18px; color: #303133;"></span>查看资料
				<div class="l-rest l-text-error l-text-center" v-show="dialogExamine.loading">
					<el-button size="mini" :loading="dialogExamine.loading" type="text">审核提交中</el-button>
				</div>
			</div>
  		<div class="l-text-gray">资料照片</div>
  		<div class="l-bankAuditsImage">
  			<img v-for="(item,index) in images" key="tick" :src="item.thumb" @click="previewImage(index)">
  		</div>
  		<div class="l-text-gray l-margin-t">客户签名视频</div>
  		<div class="l-bankAuditsvideo">
  			<d-player ref="dplayer" :video='video' :contextmenu='[]'></d-player>
  		</div>
  		<div class="l-text-center l-margin-t">
  			<el-button :disabled="dialogExamine.loading" @click="examine(0)">不通过</el-button>
		    <el-button type="primary" :disabled="dialogExamine.loading" @click="examine(1)">审批通过</el-button>
  		</div>
		</el-dialog>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import viewerImages from 'components/viewer-images'
import VueDPlayer from 'vue-dplayer'
export default {
	name: 'bank',
	components: {
		viewerImages,
    'd-player': VueDPlayer
  },
	data() {
		return {
			list: {
				filter: {
					customerPhoneNumber: '',
					isPassThrough: ''
				},
				rules: {
					customerPhoneNumber: [],
					isPassThrough: []
				},
				loading: false,
				page: 1,
				rows: 100,
				total: 0,
				data: []
			},
			images: [],
			video: {
				url: '',
				pic: ''
			},
			dialogInfo: {
				visible: false
			},
			dialogExamine: {
				loading: false,
				data: {
					customerOrderId: '',
					isPassThrough: '',
					refusalReason: ''
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
			this.$$api.bank.getList(this.list.filter, page, rows)
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
		showDialogInfo(row) { // 查看资料
			this.images = row.bankAuditsImage ? row.bankAuditsImage.split(',').map(img => {
				return {
					url: this.$$utils.image.thumb(img, 150), 
					thumb: this.$$utils.image.thumb(img, 150), 
					src: img, 
					name: img,
					tick: Date.now()
				}
			}) : []
			this.video.url = row.bankAuditsvideo
			this.dialogExamine.data.customerOrderId = row.customerOrderId
			this.dialogInfo.visible = true
		},
		closeDialogInfo(done) {
			if(done) {
				done()
			}else{
				this.dialogInfo.visible = false
			}
			this.$refs.dplayer.dp.pause()
		},
    previewImage(index = 0) {
    	this.$refs.viewer.show(index, this.images)
    },
    examine(isPass = 1) {
    	this.dialogExamine.data.isPassThrough = isPass
    	if(isPass === 1) {
    		this.examineSubmit()
    	}else {
    		this.$prompt('请输入不通过原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,}$/,
          inputErrorMessage: '请填写原因'
        }).then(({ value }) => {
          this.dialogExamine.data.refusalReason = value
          this.examineSubmit()
        })
    	}
    },
    examineSubmit() {
    	this.dialogExamine.loading = true
    	this.$$api.bank.examine(this.dialogExamine.data).then(_ => {
    		this.$message.success('审核操作成功')
    		this.refreshList()
    	}).finally(_ => {
    		this.dialogExamine.loading = false
    		this.closeDialogInfo()
    	})
    }
	},
	mounted() {
		this.getList()
	}
}
</script>
<style lang="less" scoped>
.l-bankAuditsImage{
	overflow: hidden; margin-right: -10px;
	img {float: left; width: 100px; height: 80px; margin: 10px 10px 0 0;}
}
.l-bankAuditsvideo{}
</style>