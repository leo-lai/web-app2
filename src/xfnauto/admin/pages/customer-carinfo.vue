<template>
	<div class="l-flex-v" style="height: 100%;">
		<div class="l-rest l-scroll" style="font-size:12px;">
			<table class="l-table-info">
	  		<caption>基本信息</caption>
				<tr>
					<td class="_tit">车辆型号</td>
					<td class="_cont">{{data.stockCarName}}</td>
					<td class="_tit">车辆颜色</td>
					<td class="_cont">{{data.colourName}}</td>
				</tr>
				<tr>
					<td class="_tit">车架号</td>
					<td class="_cont">{{data.frameNumber}}</td>
					<td class="_tit">发动机号</td>
					<td class="_cont">{{data.engineNumber}}</td>
				</tr>
				<tr>
					<td class="_tit">车牌号</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.licensePlateNumber" placeholder="请填写">
					</td>
					<td class="_tit">成交价格(元)</td>
					<td class="_cont">{{data.transactionPrice}}</td>
				</tr>
				<tr>
					<td class="_tit">购车方案</td>
					<td class="_cont">{{data.carPurchasePlan}}</td>
					<td class="_tit">贷款方案</td>
					<td class="_cont">{{data.carPurchasePlan}}</td>
				</tr>
				<tr>
					<td class="_tit">赠送精品</td>
					<td class="_cont">{{data.give}}</td>
					<td class="_tit">售后支持</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.afterSaleSupport" placeholder="请填写">
					</td>
				</tr>
			</table>
			<table class="l-table-info l-margin-t">
	  		<caption>税收/保险/其他花费</caption>
				<tr>
					<td class="_tit">整车购置税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.purchaseTax" placeholder="请填写">
					</td>
					<td class="_tit">消费税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.exciseTax" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">车船税</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.vehicleAndVesselTax" placeholder="请填写">
					</td>
					<td class="_tit">上牌费用</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.premium" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">强制保险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.compulsoryInsurance" placeholder="请填写">
					</td>
					<td class="_tit">第三方责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.thirdPartyLiabilityInsurance" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">车辆损失险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.vehicleLossInsurance" placeholder="请填写">
					</td>
					<td class="_tit">玻璃单独破碎险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.riskOfGlassBreakage" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">自然损失险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.selfIgnitionLossInsurance" placeholder="请填写">
					</td>
					<td class="_tit">不计免赔特约险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.exemptionFromSpecialContract" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">无过责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.noLiabilityInsurance" placeholder="请填写">
					</td>
					<td class="_tit">车上人员责任险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.personnelLiabilityInsurance" placeholder="请填写">
					</td>
				</tr>
				<tr>
					<td class="_tit">车身刮痕险</td>
					<td class="_cont">
						<input class="_ipt2" maxlength="50" v-model="data.scratchRisk" placeholder="请填写">
					</td>
					<td class="_tit"></td>
					<td class="_cont"></td>
				</tr>
			</table>
			<template v-if="data.extractCarImage && data.extractCarImage.length > 0">
				<table class="l-table-info l-margin-t">
		  		<caption>人车合照/车辆照片</caption>
		  	</table>
		  	<div style="overflow:hidden;">
		  		<img style="float:left; width: 150px; height: 100px; margin: 15px 15px 0 0;" v-for="(img,index) in data.extractCarImage" :src="img.thumb" @click="previewImage(index)">
		  	</div>
	  	</template>
		</div>
		<div class="l-text-right l-margin-t">
			<el-button type="primary" :loading="loading" @click="submit">{{loading ? '保存中...' : '保存修改'}}</el-button>
		</div>

		<viewer-images ref="viewer"></viewer-images>
	</div>
</template>
<script>
import viewerImages from 'components/viewer-images'
export default {
	name: 'customer-carinfo',
	components: {
		viewerImages
  },
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			loading: false
		}
	},
	methods: {
		submit() {
			this.loading = true
			this.$$api.customer.saveCarInfo(this.data).then(_ => {
				this.$message.success('保存车辆资料成功')
			}).finally(_ => {
				this.loading = false
			})
		},
    previewImage(index = 0) {
    	this.$refs.viewer.show(index, this.data.extractCarImage)
    }
	}
}
</script>