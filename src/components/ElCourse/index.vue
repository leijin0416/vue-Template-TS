<template>
  <div class="v-course-wrap">
    <div class="course-table" >
      <el-scrollbar style="height: 100%" >
        <div class="course-table-content" >
          <div class="top":style="{width:courseWidth * weekTable.length + 'px'}">
            <div v-for="item in weekTable" class="top-text" :style="{width: courseWidth + 'px'}">{{item.value ? item.label : '周' + item}}</div>
          </div>
          <div class="main" 
            :style="{ width:courseWidth * weekTable.length + 35 + 'px',
                      height:courseHeight * timeTable.length +'px'}">
              <div class="period">
                <div v-for="(item, i) in timeTable" :key="i" class="left-text" :style="{height: courseHeight + 'px'}">
                  <p>{{item}}</p>
                </div>
              </div>
              <!--课表-->
              <div v-for="(item, index) in usualCourses">
                <div class="flex-item kcb-item" @click="onShowUsualCourseClick(item)"
                  :style="{ marginLeft:(item.day-1) * courseWidth + 'px',
                            marginTop:(item.period-1) * courseHeight + 5+ 'px',
                            width:courseWidth + 'px',
                            height:item.length ? item.length : 1  * courseHeight - 5 +'px',
                            backgroundColor:colorArrays[index%9]}">
                  <div class="small-text" >{{item.type+'@'+item.name}}</div>
                </div>
              </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
// import { } from '@/api/index';

interface IndexData {
  page: number;
  pageSize: number;
};

@Component({
  name: "ElCourse",
  components: {
  },
})
export default class extends Vue {
  @Prop({ type: Number, default: 850 }) public width!: number;
  @Prop({ type: Number, default: 1100 }) public height!: number;
  @Prop({ type: Array, default: [] }) public usualCourses!: any; // 课程信息
  @Prop({ type: Array, default: [] }) public practiceCourses!: any;
  @Prop({ type: Array, default: ['一','二','三','四','五','六','日'] }) public weekTable!: any;
  @Prop({ type: Array, default: ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00',] }) public timeTable!: any;
  @Prop({ type: Array, default: ['#ef5b9c','#f15b6c', '#f26522', '#ffd400', '#8552a1', '#7fb80e', '#65c294', '#78cdd1', '#33a3dc'] }) public colorArrays!: any;

  private vm = window['vm'];

  // 分页器
  private param: IndexData = {
    page: 1,
    pageSize: 12,
  };
  
  private showUsualCourseDialog = false;
  private showPracticeCourseDialog = false;
  private selectedCourseIndex = 0;

  // 获取数据
  get courseWidth() {
    return Math.max((this.width - 35) / this.weekTable.length,50)
  };
  get courseHeight() {
    return Math.max((this.height - 35) / this.timeTable.length,50)
  };
  get selectedCourse() {
    return this.usualCourses[this.selectedCourseIndex]
  };

  // 监听数据列表
  @Watch('courseWidth', { deep: true })
  getWatchCourseWidth(newValue) {
    // console.log(newValue)
  };

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {};

  // 点击课表
  private onShowUsualCourseClick(val) {
    // console.log(val);
    this.$emit('OnEmitShowCourseInfoClick', val);
  }

}
</script>

<style lang='scss' scoped>
.v-course-wrap {
  padding: 15px;
  text-align: center;
  .course-table {
    display: inline-block;
    font-size: 14px;
    border-radius: 12px;
    border: 1px solid #eee;
    overflow: hidden;
  }
  .top {
    display: flex;
    flex-direction: row;
    padding-left: 80px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #31c27c;
    color: #fff;
  }
  .top-text {
    width: 100px;
    height: 35px;
    font-size: 14px;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .main{
    height:1200px;
    width:730px;
    display:flex;
    position: relative;
  }
  .flex-item {
    width: 95px;
    height: 200px;
  }
  .kcb-item {
    position: absolute;
    justify-content: center;
    display: flex;
    align-items: center;
    border-radius: 12px;
    overflow: hidden;
  }
  .period{
    background-color:#31c27c;
    color:#fff;
  }
  .small-text {
    padding: 0 5px;
    font-size: 14px;
    color: #fff;
    text-align: center;
  }
  .left-text {
    width: 80px;
    height: 100px;
    font-size: 14px;
    justify-content: center;
    display: flex;
    align-items: center;
  }
  .btn_practice_course{
    position: absolute;
    z-index: 110;
    top: 35px;
    right: 0px;
    width: 100px;
    height: 100px;
    line-height: 24px;
    background: #31c27c;
    border-radius: 50px;
    font-size: 18px;
    text-align: center;
    color: #fff;
    opacity: 0.7;
    padding: 12px;
  }
  .el-dialog .dialog-content{
    color: #000;
    line-height: 60px;

  }
  .el-dialog .dialog-content .tip{
    color: #000;
    line-height: 60px;
    text-align: center;
  }
}
</style>