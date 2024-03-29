<template>
  <!-- 富文本 -->
  <div class="v-template-main">
    <div class="editor">
      <div ref="toolbar" class="toolbar"></div>
      <div ref="editor" class="text"></div>
    </div>
  </div>
</template>

<script lang="ts">
import E from 'wangeditor';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';

type IndexData = {
  page: number;
  pageSize: number
};
@Component({
  components: {
  },
})
export default class WangEditors extends Vue {
  @Prop({ default: false }) isClear!: Boolean;
  @Prop({ default: '' }) value: String;
  
  private editor: any = null;      // ID
  private infoContent: any = null  // 内容值

  private uploadImageServer: string = 'http://185.251.248.xxxx/api/ping-shop-web/app/uploadFile';  // :10086
  private uploadImageDevs: string = 'http://otp.cdinfotech.top/file/upload_images';
  

  // 获取数据
  get getUserLevelList() {
    return
  };

  // 监听数据列表
  @Watch('isClear', { deep: true })
  watchIsClearTextChange(newValue) {  // 监听 触发清除文本域内容
    if (newValue) {
      this.editor.txt.clear();
      this.infoContent = null;
    }
    // console.log(newValue)
  };
  @Watch('value', { deep: true })
  watchValueTextChange(newValue) {  // 监听 value为编辑框输入的内容
    if (newValue !== this.editor.txt.html()) {
      this.editor.txt.html(this.value);
    }
  };

  // 生命周期
  created() {};

  // 生命周期
  mounted () {
    this.seteditor();
    if(this.value) this.editor.txt.html(this.value);
  };

  /**
   * @description: 富文本编辑器  https://www.wangeditor.com
   * @param {Object} editor      -创建
   * @param {String} infoContent -当前值
   * @return {*} 
   */
  private seteditor() {
    const refToolbar: any = this.$refs.toolbar;
    const refEditor: any = this.$refs.editor;

    this.editor = new E(refToolbar, refEditor);
    this.editor.config.uploadImgShowBase64 = false; // base 64 存储图片
    this.editor.config.uploadImgServer = this.uploadImageDevs;  // 配置服务器端地址
    this.editor.config.uploadImgHeaders = {  // 自定义 header
      AuthType: "WEB",
    };
    this.editor.config.uploadFileName = 'file'; // 后端接受上传文件的参数名
    this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
    this.editor.config.uploadImgMaxLength = 3; // 限制一次最多上传 3 张图片
    this.editor.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

    /** 配置菜单
     * 
      'video', // 插入视频
      'code', // 插入代码
      'emoticon', // 表情
      'fullscreen' // 全屏
     */
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'indent', // 缩进
      'lineHeight', // 行高
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'image', // 插入图片
      'table', // 表格
      'undo', // 撤销
      'redo', // 重复
    ];
    this.editor.config.zIndex = 999;

    this.editor.config.uploadImgHooks = {
      fail: (xhr, editor, result) => {      // 插入图片失败回调
      },
      success: (xhr, editor, result) => {   // 图片上传成功回调
      },
      timeout: (xhr, editor) => {  // 网络超时的回调
      },
      error: (xhr, editor) => {   // 图片上传错误的回调
      },
      customInsert: (insertImg, result, editor) => {
        // console.log(result)
        // 图片上传成功，插入图片的回调
        // insertImg()为插入图片的函数
        let url = result.data.filePath;  // let url = "http://otp.cdinfotech.top" + result.url
        insertImg(url);
      }
    }
    this.editor.config.onchange = (html) => {
      this.infoContent = html;   // "绑定" 当前逐渐地值
      this.$emit('emitEditorChange', this.infoContent); // 将 "绑定" 内容同步到父组件中
    }
    // 创建富文本编辑器
    this.editor.create();
  }

  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  };
}
</script>

<style lang='scss' scoped>
.v-template-main {
  margin: 5px 0;
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    border-top: 0;
    min-height: 600px;
  }
}
</style>