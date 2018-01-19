<template>
	<div class="l-main-body">
		<div class="l-dashboard-map">
			<el-amap :zoom="14" :center="mapCenter" :events="mapEvents">
	      <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker.position" :content="marker.content" :visible="true"></el-amap-marker>
	    </el-amap>
		</div>
		<div class="l-dashboard-count">
			<span>设备总数：<b>{{dashboard.device_count}}</b></span>
			<span>商家总数：<b>{{dashboard.seller_count}}</b></span>
			<span>充值总金额：<b>{{dashboard.seller_recharge_amount}}</b></span>
		</div>
	</div>
</template>
<script>

export default {
	name: 'datamap',
	data() {
		let that = this
		return {
			mapEvents: {
				init(map) {
					that.$map = map
					that.getMap()
				}
			},
			mapCenter: [121.5273285, 31.21515044],
			dashboard: {
				seller_count: 0,
				device_count: 0,
				seller_recharge_amount: 0
			},
			markers: []
		}
	},
  methods: {
    getMap() {
      this.$$api.dashboard.getMap().then(data => {
        this.dashboard = data
        let avgLng = 0, avgLat = 0
        data.map_list.forEach((item,index) => {
        	avgLng += Number(item.longitude) <= 180 ? Number(item.longitude) : 0
        	avgLat += Number(item.latitude) <= 90 ? Number(item.latitude) : 0
        	this.markers.push({
	        	position: [Number(item.longitude), Number(item.latitude)],
	        	content: '<div class="l-map-marker">'+ (index+1) +'</div>'
	        })
        })
        avgLng = avgLng / data.map_list.length
        // avgLat = avgLat / data.map_list.length
        // this.mapCenter = [avgLng, avgLat]
       	setTimeout(_ => {
       		this.$map.setFitView()	
       	}, 50)
      })
    }
  },
  mounted() {
    
  }
}
</script>
<style scoped lang="less">
.l-dashboard-map{
	width: 100%;
	height: 500px;
}
.l-dashboard-count{
	padding: 10px 0; text-align: right;
	span{margin: 0 0 0 30px; }
	b{color: red;}
}

.l-map-marker{
  background: url(/static/marker.png) no-repeat 50% 50%; background-size: 100% 100%; position: relative;
  width: 40px; height: 40px; text-align: center; color: #fff; line-height: 30px; font-family: monospace; font-weight: bold;
}
.l-map-marker:after{
  content: '';
  position: absolute; bottom: -10px; left: 5px; right: 5px; height: 10px;
  background-image: radial-gradient(ellipse closest-side, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>
