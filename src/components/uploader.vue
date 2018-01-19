<template>
  <div>
    <el-upload class="l-upload-card" :class="{'_limit': uploadList.length >= limit }" accept="image/*" list-type="picture-card" multiple :limit="limit"
      :file-list="fileList"
      :action="$$api.baseURL + '/uploadImage'" name="img_file"
      :on-success="uploadSuccess"
      :on-remove="uploadRemove"
      :on-preview="uploadPreview" 
      :on-progress="uploadProgress" 
      :on-error="uploadError" 
      :on-exceed="uploadExceed"
      :before-upload="uploadBefore">
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 预览图片 -->
    <viewer-images ref="viewer" :images="uploadList"></viewer-images>
  </div>
</template>
<script>
import viewerImages from 'components/viewer-images'
export default {
  components: {
    viewerImages
  },
  props: {
    fileList: {
      type: Array,
      default: []
    },
    limit: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      waiting: 0,
      uploadList: []
    }
  },
  methods: {
    uploadSuccess(response, file, fileList) {
      this.uploadList.push({
        name: file.name,
        url: this.$$utils.image.thumb(response.data, 150),
        thumb: this.$$utils.image.thumb(response.data, 150),
        src: response.data,
        status: 'success'
      })
      if(--this.waiting <= 0) {
        this.$emit('update:fileList', this.uploadList)
      }
    },
    uploadBefore(file) {
      ++this.waiting
    },
    uploadPreview(file) {
      this.$refs.viewer.show(this.uploadList.findIndex(item => item.url === file.url) || 0)
    },
    uploadRemove(file, fileList) {
      if(file.status === 'success') {
        this.uploadList = this.uploadList.filter(item =>  {
          if(file.response) {
            return item.src !== file.response.data
          }else {
            return item.src !== (file.src || file.url)
          }
        })
        this.$emit('update:fileList', this.uploadList)
      }else {
        --this.waiting
      }
    },
    uploadProgress(event, file, fileList) {
      
    },
    uploadError(error, file, fileList) {
      // this.$message.error(`图片${file.name}上传失败`)
      this.$notify.error({
        title: '上传失败',
        message: `图片${file.name}上传失败`
      })
    },
    uploadExceed(files, fileList) {
      this.$message.error('最多上传' + this.limit + '张照片')
    }
  },
  watch: {
    fileList(val) {
      if(val && val.length >= 0) {
        this.uploadList = [...val]
      }
    }
  },
  mounted () {
    this.uploadList = [...this.fileList]
  }
}
</script>
<style lang="less">
.l-upload-card{
  .el-upload-list--picture-card .el-upload-list__item,
  .el-upload--picture-card{
    width: 80px; height: 80px;
  }
  .el-upload--picture-card{
    line-height: 80px;
  }
  .el-icon-close-tip{font-size: 0;}
  &._limit .el-upload--picture-card{
    visibility: hidden;
  }
}

</style>