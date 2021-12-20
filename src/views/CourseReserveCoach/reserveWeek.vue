<template>
  <div class="pages">
    <div class="v-header-box">
      <h2 class="v-title" >{{$t('User.会员预约课程表')}}</h2>
    </div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="20" :xl="16">
        <div class="v-form-wrap">
          <div class="v-course-info">
            <div class="v-select-box">
              <div class="weui-flex">
                <div class="weui-flex-hd text-red"><i class="el-icon-discount"></i> {{$t('User.查看方式')}}</div>
                <div class="weui-flex-bd">
                  <el-radio-group v-model="radioType" text-color="#999" @change="onRadioWeekClick">
                    <el-radio label="1">{{$t('User.按星期')}}</el-radio>
                    <el-radio label="2">{{$t('User.按具体时间')}}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="weui-flex" v-if="radioType === '2'">
                <div class="weui-flex-hd"><i class="el-icon-date"></i> {{$t('User.选择课表日期')}}</div>
                <div class="weui-flex-bd">
                  <el-date-picker
                    style="width: 38%"
                    popper-class="v-picker-box"
                    v-model="param.startDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :placeholder="$t('User.选择日期')"
                    :editable="false"
                    @change="getPagesList" >
                  </el-date-picker>
                </div>
              </div>
              <div v-if="radioType === '1'">
                <el-tabs v-model="param.startDate" @tab-click="getPagesList">
                  <el-tab-pane v-for="item in formOptionsWeeks" :label="item.weekDate" :name="item.weekDate" :key="item.weekDate"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
            <h2 class="v-h2-time">{{$t('User.当前课表日期')}} - {{usualCoursesDayTime}}{{usualCoursesDayWeek}}</h2>
            <ElCourse
              :weekTable="headerOptionsData"
              :timeTable="timeOptionsData"
              :usualCourses="usualCoursesInfo"
              @OnEmitShowCourseInfoClick="onEmitShowCourseInfoClick" />
          </div>

          
          <!-- 左侧弹窗 -->
          <el-drawer
            direction="rtl"
            :title="this.$t('User.课程信息')"
            :with-header="false"
            :show-close="false"
            :append-to-body="true"
            :visible.sync="drawerFormVisible"
            @close="onDrawerFormClose"
            size="47%" >
            <div class="v-header-title">
              <div class="v-title weui-flex">
                <div class="weui-flex-bd">
                  <h2 class="v-h2">
                    <span>{{ $t('User.课程类型') }}: </span>
                    <span>{{drawerRowData.className}}</span>
                  </h2>
                </div>
                <div class="weui-flex-ft">
                  <h3 class="v-h3">
                    <span>{{ $t('User.教练姓名') }}: </span>
                    <span>{{drawerRowData.coachName ? drawerRowData.coachName : '-'}}</span>
                  </h3>
                </div>
              </div>
              <div class="v-text-bottom">
                <p class="v-text">
                  <span>{{ $t('User.排班编号') }}: </span>
                  <span>{{drawerRowData.scheduleId}}</span>
                </p>
                <p class="v-text">
                  <span>{{ $t('User.泳道') }}: </span>
                  <el-tag type="info" size="small">{{drawerRowData.laneName}}</el-tag>
                </p>
                <p class="v-text">
                  <span>{{ $t('User.状态') }}: </span>
                  <el-tag size="small" type="danger" v-if="drawerRowData.status === -1">{{$t('User.已取消')}}</el-tag>
                  <el-tag size="small" v-else-if="drawerRowData.status === 1">{{$t('User.待完成')}}</el-tag>
                  <el-tag size="small" v-else-if="drawerRowData.status === 2">{{$t('User.已完成')}}</el-tag>
                  <el-tag size="small" v-else>-</el-tag>
                </p>
                <p class="v-text">
                  <span>{{ $t('User.总预约数量') }}: </span>
                  <span>{{drawerRowData.totalCount}}</span>
                </p>
                <p class="v-text">
                  <span>{{ $t('User.上课时间') }}: </span>
                  <span>{{usualCoursesDayTime}}{{usualCoursesDayWeek}} {{drawerRowData.startTime}}</span>
                </p>
              </div>
            </div>
            <div class="content">
              <h3 class="v-h3"><i class="el-icon-s-management"></i> {{ $t('User.已预约用户') }}: </h3>
              <ElTable 
                :tableData="tableData"
                :tableColumnData="tableColumnData"
                :totalCount="totalCount"
                @handleSelectionChange="handleSelectionChange"
                @handleCurrentChange="handleCurrentChange">
                <el-table-column slot="operateTagCourseStatus" :label="$t('User.状态')" width="150" align='center'>
                  <template slot-scope="scope">
                    <el-tag type="info" v-if="scope.row.status === 1">{{$t('User.未签到')}}</el-tag>
                    <el-tag v-else-if="scope.row.status === 2">{{$t('User.已签到')}}</el-tag>
                    <el-tag type="danger" v-else-if="scope.row.status === 0">{{$t('User.已取消')}}</el-tag>
                    <el-tag v-else>{{$t('User.已完成')}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column slot="operateTagCarryNum" :label="$t('User.携带人数')" width="150" >
                  <template slot-scope="scope">
                    <span>{{scope.row.carryNum}}</span>
                  </template>
                </el-table-column>
              </ElTable>
            </div>
          </el-drawer>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
import { regBlank } from '@/filters/RegexSplit';
import { MessageTips } from '@/filters/MessageTips';
import { 
  webGetAdminPageCoachsCourseListInfo,
  webGetAdminPageCoachDayTimeList,
  webGetAdminPageCoachSchedulingWeeksDate,
  webGetAdminPageCoachLaneList,
  webGetAdminPageCoachsCourseList,
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";
import ElCourse from "@/components/ElCourse/index.vue";

interface IndexData {
  id: string | number;
  packagesName: string;
  benefit: string | number;
  price: string | number;
  leisureClass: string | number;
  officialClassNum: string | number;
  duration: string | number;
};
@Component({
  name: "CourseReserveCoachWeek",
  components: {
    ElCourse,
    ElTable,
  },
})
export default class extends Vue {
  private vm = window['vm'];
  private userRegisterInfo: any = '';
  private usualCoursesId: any = 1;

  // 分页器
  private param = {
    coachId: '',
    endDate: '',
    startDate: '',
  };
  private ruleForm: any = {
    coachId: '',
    id: '',
    name: '',
    laneId: '',
    scheduleDate: '',
    totalCount: '',
    timeId: '',
    classTypeId: '',
    startTime: '',
    endTime: '',
  };

  private usualCoursesDayWeek = '';
  private usualCoursesDayTime = '';
  private usualCoursesInfo = [];
  private courseTypeOptionsData = [];
  private timeOptionsData = [];
  private headerOptionsData = [];
  private formOptionsWeeks = [];
  private radioType = '1';

  private loadingType = false;
  private drawerFormVisible = false;
  private drawerRowData = {
    scheduleId: '',
    memberScheduleVoList: []
  };
  private memberIdList: any = [];
  private getTablePagesList: any = [];

  private totalCount: number = 0; // 表格总数
  private tableData: any = [];    // 表格数据
  private tableColumnData = [
    {
      prop: 'memberId',
      label: this.vm.$t('User.会员编号'),
      width: '180',
    },
    {
      prop: 'memberName',
      label: this.vm.$t('User.姓名'),
      width: '220',
    },
    {
      slot: 'operateTagCourseStatus', // 内容slot
    },
    {
      slot: 'operateTagCarryNum', // 内容slot
    },
    {
      prop: 'createTime',
      label: this.vm.$t('User.创建时间'),
      width: '170',
    },
    {
      slot: 'operateButton', // 内容slot
    },
  ]; // 表格行头

  // 表单验证
  private validateuserName = (rule: any, value: string, callback: (res?: any) => {}) => {
    if (value === '') {
      const text = this.vm.$t('Hlin.请输入用户名');
      callback(new Error(text));
    } else if (!regBlank.test(value)) {
      const text = this.vm.$t('Hlin.请勿输入空字符');
      callback(new Error(text));
    } else {
      callback();
    }
  };

  /** 
   * @description: 验证规则
	 * @param {*} required  是否必填
	 * @param {*} message  提示语
	 * @param {*} trigger  触发 blur失去焦点后
   * @return {*}
   */
  private rules = {
    totalCount: [
      { required: true, message: this.vm.$t('User.请输入') + this.vm.$t('User.总预约数量'), trigger: 'blur' },
      { required: true, pattern: regBlank, message: this.vm.$t('User.不能含有空格'), trigger: 'blur' },
    ],
    classTypeId: [
      { required: true, message: this.vm.$t('User.请选择') + this.vm.$t('User.课程类型'), trigger: 'change' },
    ],
    timeId: [
      { required: true, message: this.vm.$t('User.请选择') + this.vm.$t('User.上课时间'), trigger: 'change' },
    ],
  };

  // 获取数据
  get getAdminSystemMenuRoleList() {
    return
  };

  @Watch('getTablePagesList', { deep: true })
  getWatchTablePagesList(newValue) {
    // console.log(newValue)
    if(newValue.data) {
    }
  };
  @Watch('userRegisterInfo', { deep: true })
  getWatchUserRegisterInfo(newValue) { // 查信息表
    // console.log(newValue)
    if(newValue === 0) {
      this.drawerFormVisible = false;
      this.getPagesList();

    } else {
      this.ruleForm.coachId = newValue.id;
      this.ruleForm.name = newValue.name;
    }
  };
  @Watch('usualCoursesId', { deep: true })
  getWatchUserCoursesId(newValue) {  // 查信息表
    // console.log(newValue)
    if(newValue === 2) this.getPagesList(); 
  };

  // 生命周期
  created() {
    this.getPagesCommonList();
    this.getPagesList();
  };

  // 生命周期
  mounted () {};

  // 重置
  private resetForm(formName) {
    const _that = this;
    const ref: any = _that.$refs[formName];
    ref.resetFields();
  }
  private resetSearchForm() {
    const _that = this;
    Object.keys(_that.param).forEach(key => {
      if(key !== 'status') _that.param[key] = ''
    });
  }

  // 复选框
  private handleSelectionChange(val) {
    console.log(val);
    this.memberIdList = val;
  }

  // 分页
  private handleCurrentChange(val) {
    // this.param.page = val;
    // console.log(this.param);
  }

  /**
   * @description: 返回上级
   * @param {*}
   * @return {*}
   */
  private onGoBackClick() {
    if(this.usualCoursesId !== 2) this.resetForm('ruleForm');
    if(this.usualCoursesId === 1) {
      this.usualCoursesId = 2;
      Object.keys(this.ruleForm).forEach(key => {
        this.ruleForm[key] = ''
      });

    } else {
      this.resetSearchForm();
      this.$emit('onEmitGoBackClick', true);
    }
  }

  private onRadioWeekClick(val) {
    const startDate = '';
    this.$nextTick(() => {
      this.param.startDate = startDate;
      this.getPagesList();
    })
  }

  // 格式
  private getFilterCourseData(item, name:string, name2:string) {
    let filter: any = [];
    let data = item.map( (value,index,arry) => {
      filter.push({ 'value': value[name], 'label': value[name2] })
    });
    return filter
  }

  /**
   * @description: 排班 -获取选择框数据
   * @param {*} days   上课时间
   * @param {*} lanes  泳道
   * @param {*} course 课程类型
   * @return {*}
   */
  private async getPagesCommonList() {
    const days = await webGetAdminPageCoachDayTimeList({});
    const lanes = await webGetAdminPageCoachLaneList({});
    const course = await webGetAdminPageCoachsCourseList({});
    const weeks = await webGetAdminPageCoachSchedulingWeeksDate({});

    if(days.data.code === 200) {
      let dayTime = days.data.data;
      let lanesData = lanes.data.data;
      let courseData = course.data.data;
      
      this.timeOptionsData = this.getFilterCourseData(dayTime, 'id', 'startTime');
      this.headerOptionsData = this.getFilterCourseData(lanesData, 'id', 'laneName');
      this.courseTypeOptionsData = this.getFilterCourseData(courseData, 'id', 'className');
      this.formOptionsWeeks = weeks.data.data;
      // console.log(weeks);

    } else console.log(days);
  }

  /**
   * @description: 获取排班课程表
   * @return {*}
   */
  private async getPagesList() {
    const {startDate} = this.param;
    const {data} = await webGetAdminPageCoachsCourseListInfo({"startDate": startDate});

    if(data.code === 200) {
      // console.log(res);
      const list = data.data.scheduleList;
      let objs = deepCloneData(list);
      this.usualCoursesDayTime = data.data.date;
      this.usualCoursesDayWeek = '(' + data.data.week + ')';
      this.param.startDate = data.data.date;

      if(objs.length > 0) {
        objs.forEach( el => {
          el.day = el.laneId;
          el.name = el.coachName;
          el.type = el.className;
          el.period = el.timeId;
        });
        this.usualCoursesInfo = objs;

      } else this.usualCoursesInfo = []

    } else console.log(data);
  }

  /**
   * @description: 关闭弹出层
   * @return {*}
   */
  onDrawerFormClose() {
    this.drawerFormVisible = false;
  }

  /**
   * @description: 右侧弹出层
   * @param {*} val 数据
   * @return {*}
   */
  private onEmitShowCourseInfoClick(item: any) {
    // console.log(item);
    this.drawerRowData = item;
    this.tableData = item.memberScheduleVoList;
    this.totalCount = item.memberScheduleVoList.length;
    this.drawerFormVisible = true;
  }
}
</script>

<style lang='scss' scoped>
/deep/.el-tabs__active-bar {background-color: red !important;}
/deep/.el-tabs__item.is-active {color: red !important;}
/deep/.el-drawer__body {
  overflow: hidden;
  overflow-y: auto;
  .v-header-title {
    padding: 5px 15px 10px;
    .v-title {padding: 15px 0;}
    .v-h3 {font-size: 18px;}
    span {
      display: inline-block;
      margin-right: 15px;
    }
    .v-text-bottom {
      padding: 0 0 10px; 
      border-bottom: 1px solid #f1f1f1;
      span:nth-child(1) {color: #999;}
      .v-text {
        padding: 5px 0;
      }
    }
  }
  .content {
    padding: 10px 15px;
    .v-h3 {
      padding: 0 0 15px;
      font-size: 18px;
      color: #409eff;
    }
    .v-btn-box {
      margin-bottom: 15px;
    }
    .v-block-line {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}

.pages {
  .v-header-box {
    position: relative;
    padding: 20px 20px 10px;
    .v-text {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 10px;
      font-size: 16px;
      color: #666;
    }
  }
}
.v-form-wrap {
  padding: 20px;
  .v-form {
    width: 60%;
  }
  .v-course-info {
    .v-h2-time {
      text-align: center;
    }
    .v-select-box {
      margin-bottom: 40px;
      /deep/.el-radio__input.is-checked+.el-radio__label {color: red !important;}
      /deep/.el-radio__input.is-checked .el-radio__inner {
        border-color: red !important;
        background: red !important;
      }
      .weui-flex {
        margin: 5px 0 20px;
      }
      .weui-flex-hd {min-width: 100px; margin-right: 30px; font-weight: bold;}
    }
  }
  .v-title {
    padding: 0 0 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #f1f1f1;
  }
  .v-btn-box {
    margin-top: 50px;
    .v-btn {
      width: 45%;
    }
  }
  .v-info-box {
    padding: 15px;
    .v-list {
      margin: 10px 0;
    }
    .weui-flex {
      padding: 15px 0;
      border-bottom: 1px solid #f1f1f1;
      &:last-child {border: none;}
      .weui-flex-hd {
        min-width: 120px;
        color: #666;
      }
    }
  }
}
</style>