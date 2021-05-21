<template>
  <!--是否行内表单-->
  <el-form 
    :inline="inline" 
    :model="form" 
    ref="form" 
    :rules="rulesData"
    :label-width="labelWidth">
    <!--标签显示名称-->
    <el-form-item
      v-for="item in formLabelData"
      :key="item.model"
      :label="item.label"
    >
      <!--根据type来显示是什么标签-->
      <el-input
        v-model="form[item.model]"
        :placeholder="'请输入' + item.label"
        v-if="item.type === 'input'"
      ></el-input>
      <el-select
        v-model="form[item.model]"
        placeholder="请选择"
        v-if="item.type === 'select'"
      >
        <!--如果是select或者checkbox 、Radio就还需要选项信息-->
        <el-option
          v-for="item in item.opts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-switch
        v-model="form[item.model]"
        v-if="item.type === 'switch'"
      ></el-switch>
      <el-date-picker
        v-model="form[item.model]"
        type="date"
        placeholder="选择日期"
        v-if="item.type === 'date'"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </el-form-item>
    <!--留一个插槽-->
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { sessionData } from '@/filters/storage';

@Component({
  components: {
  },
})
export default class formLabelData extends Vue {
  /** https://www.cnblogs.com/qiezuimh/p/11081525.html  https://www.cnblogs.com/qdhxhz/p/12649759.html
   *  @param Array<object>     -数组泛型，Array<元素类型>
   *  @function warnUser(): void    -表示没有返回值的函数
   */
  @Prop({ default: {} }) form!: Array<object>;           // 表单参数
  @Prop({ default: [] }) formLabelData!: Array<object>;  // 表单标签数据
  @Prop({ default: true }) inline!: Boolean;            //  是否行内
  @Prop({ default: '100px' }) labelWidth!: String;      //  标签宽度
  @Prop({ default: {} }) rulesData!: Array<object>;     // 表单参数校验
  
  
  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {
  };

  private initUserList(): void {}

}
</script>