<template>
  <!-- 上传 -->
  <div class="v-upload-wrap">
    <el-upload
      ref="pictureUpload"
      class="avatar-uploader"
      :accept="acceptImgType"
      :before-upload="onBeforeUpload"
      :limit="limitImages"
      :action="actionUrl"
      :headers="myHeaders"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :on-success="handleUploadImgSuccess" >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="demo-upload-list" v-for="(item, index) in imageListData" :key="item.uid">
      <img :src="item.url" class="v-img" alt="upload" />
      <div class="demo-upload-list-cover">
        <span class="el-upload-list__item-actions" @click="handleRemoveImage(item)">
          <i class="el-icon-delete"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
// import { } from '@/api/index';

type IndexData = {
  page: number;
  pageSize: number
};

@Component({
  components: {
  },
})
export default class ElUploads extends Vue {
  @Prop({ default: 1 }) limitImages: number;    // 上传个数

  private actionUrl: string = 'http://192.168.1.102/whale-swim/api/cn-product/uploadFile';  // 上传地址
  private acceptImgType: string = ".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"; // 格式限制
  private myHeaders = {
		AuthType: "WHALE_ADMIN",
  };
  private imageListData: any = [];

  // 获取数据
  get getUserPageList() {
    return
  };

  // 监听数据列表
  @Watch('limitImages', { deep: true, immediate: true })
  getWatchLimitImages(newValue) { // 监听个数
    if(newValue === 0) this.imageListData = [];
  };

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {
  };

  private handleExceed(files, fileList) {
    this.$message.warning(
      `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，已上传了 ${fileList.length} 个文件`
    );
  }

  // 格式
  private onBeforeUpload(file) {
    const isIMAGE = file.type === 'image/jpeg'||'image/gif'||'image/png';
    const isLt1M = file.size / 1024 / 1024 < 1;

    if (!isIMAGE) {
      this.$message.error('上传文件只能是图片格式!');
    }
    if (!isLt1M) {
      this.$message.error('上传文件大小不能超过 1MB!');
    }
    return isIMAGE && isLt1M;
  }
  
  /** 
   * @description: 图片删除，返回父级
   * @param {*} uploadFiles 匹配
   * @param {*} file 标识符
   * @return {*}
   */  
  private handleRemoveImage(file) {
    const ref: any = this.$refs['pictureUpload'];
    const uploadFiles = ref.uploadFiles;
    for (let i = 0; i < uploadFiles.length; i++) {
      if (uploadFiles[i]['uid'] == file.uid) {
        uploadFiles.splice(i, 1)
        this.imageListData.splice(i, 1)
      }
    }
    this.$emit('OnEmitUploadImgRemove', this.imageListData);
  }
  
  /** 
   * @description: 图片上传成功，返回父级
   * @param {*} res   接口返回数据
   * @param {*} file  图片文件源
   * @return {*}
   */
  private handleUploadImgSuccess(res, file) {
    // console.log(res);
    // console.log(file);
    const params = {
      uid: file.uid,
      url: res.data.filePath,
    }
    this.imageListData.push(params);
    this.$emit('OnEmitUploadImgSuccess', params);
  }
}
</script>

<style lang='scss' scoped>
// 上传图片
.avatar-uploader /deep/.el-upload {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

// 图片列表
.demo-upload-list {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-right: 10px;
  text-align: center;
  line-height: 80px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  background: #fff;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #fbfbfb;
}
.demo-upload-list-cover {
  display: none;position: absolute;top: 0;bottom: 0;
  left: 0;right: 0;background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;font-size: 20px;cursor: pointer;margin: 0 2px;
}
.demo-upload-pdf {
  font-size: 12px;
  .weui-flex {
    padding: 5px 0;
    line-height: 1;
  }
  .weui-flex-bd {
    cursor: pointer;
    min-width: 40px;
    text-align: right;
    &:hover {
      color: red;
    }
  }
}
</style>