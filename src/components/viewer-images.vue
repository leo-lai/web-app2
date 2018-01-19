<template>
  <div class="l-viewer">
    <!-- 预览图片 -->
    <img v-for="{thumb, src} in imageList" :key="src" :src="thumb" :data-source="src" >
  </div>
</template>
<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
const defaults = {
  zIndex: 100000000,
  inline: false,
  button: true,
  navbar: true,
  title: false,
  toolbar: true,
  tooltip: false,
  movable: true,
  zoomable: true,
  rotatable: true,
  scalable: true,
  transition: true,
  fullscreen: true,
  keyboard: true,
  url: 'data-source'
}
export default {
  props: {
    images: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object
    }
  },
  data() {
    return {
      imageList: []
    }
  },
  methods: {
    createViewer () {
      if(this.imageList.length > 0) {
        this.destroy()

        const options = Object.assign({}, defaults, this.options)  
        this.$viewer = new Viewer(this.$el, options)
      }
    },
    show(index = 0, images = []) {
      if(images && images.length > 0) {
        this.imageList = images
      }

      this.$nextTick(_ => {
        clearTimeout(this.timeid)
        this.timeid = setTimeout(_ => {
          if(this.$viewer) {
            this.$viewer.index = index
            this.$viewer.show()
          }
        }, 200)
      })
    },
    destroy() {
      this.$viewer && this.$viewer.ready && this.$viewer.destroy()
    }
  },
  watch: {
    imageList(val) {
      this.$nextTick(_ => {
        if(this.$viewer && this.$viewer.ready){
          this.$viewer.update()
          this.$viewer.reset()
        }else {
          this.createViewer()  
        }
      })
    },
    images (val) {
      if(val && val.length > 0){
        this.imageList = val  
      }
    },
    options: {
      handler: function() {
        this.$nextTick(_ => {
          this.createViewer()
        })
      },
      deep: true
    }
  },
  destroyed () {
    this.destroy()
  }
}
</script>
<style>
.l-viewer{position: fixed; top:0; left:0; width: 0; height: 0;  z-index: -1;}
.viewer-container{background-color: rgba(0, 0, 0, .9) !important}
.viewer-button{width: 90px !important; height: 90px !important; transform: scale(1.2);}
</style>