<template>
	<div class="l-main-body">
		<el-tabs v-model="tabActive" @tab-click="tabClick" type="border-card">
		  <el-tab-pane label="菜单配置" name="menu">
		  	<base-data-menu></base-data-menu>
		  </el-tab-pane>
		  <el-tab-pane label="车型资料" name="car">
		  	<base-data-car></base-data-car>
		  </el-tab-pane>
		  <el-tab-pane label="颜色及内饰" name="color">
		  	<base-data-color></base-data-color>
		  </el-tab-pane>
		  <el-tab-pane label="供应商" name="supplier">
		  	<base-data-supplier></base-data-supplier>
		  </el-tab-pane>
		</el-tabs>

	</div>
</template>
<script>
import baseDataMenu from './base-data-menu'
import baseDataCar from './base-data-car'
import baseDataColor from './base-data-color'
import baseDataSupplier from './base-data-supplier'
export default {
	name: 'base-data',
	components: {
		baseDataMenu,
		baseDataCar,
		baseDataColor,
		baseDataSupplier
	},
	data() {
		return {
			tabActive: ''
		}
	},
	methods: {
		tabClick() {
			this.$$utils.history.replace('?tab=' + this.tabActive)
			this.$$event.$emit('base-data:tab', this.tabActive, this)
		}
	},
	mounted() {
		this.tabActive = this.$route.query.tab || 'menu'
		this.tabClick()
	}
}
</script>