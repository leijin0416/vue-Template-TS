<template>
  <!-- 推广列表 -->
  <div class="container">
    <div class="v-tooltip-box">
      <el-tooltip class="item" effect="dark" content="点击用户头像可以进行按钮操作" placement="right-start">
        <div class="v-icon">
          <i class="el-icon-question" ></i><span>说明</span>
        </div>
      </el-tooltip>
    </div>
    <TreeChart :json="treeData" @click-node="onNodeClick" />
    <div>
      <Echarts />
    </div>
    <el-drawer
      :visible.sync="drawerType"
      :show-close="false"
      :with-header="false"
      @close="onDrawerClose"
      >
      <div class="v-header-mian">
        <h3 class="v-h3">信息</h3>
      </div>
      <div class="v-text-mian">
        <div class="v-text">
          <span>ID:</span>
          <span>{{formTreeData.id}}</span>
        </div>
        <div class="v-text">
          <span>用户名:</span>
          <span>{{formTreeData.name}}</span>
        </div>
        <div class="v-button-box">
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onChildrenClick(1)">新增</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="onChildrenClick(2)">修改</el-button>
          <el-button type="primary" size="small" icon="el-icon-delete" @click="onChildrenClick(3)">删除</el-button>
        </div>
      </div>
      <div class="v-form-box" v-if="drawerFormType">
        <el-form
          ref="ruleForm"
          label-width="97px"
          class="demo-ruleForm"
          :rules="rules"
          :model="formData">
          <el-form-item label="用户ID" v-if="childrenType === 2">
            <el-input type="text" v-model="formData.id" size="medium" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input type="text" v-model="formData.name" size="medium"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingType" size="small" class="v-btn-box" >
              {{childrenType === 2 ? '确认修改' : '确认新增'}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';
import { MessageTips } from '@/filters/MessageTips';
import { sessionData } from '@/filters/storage';

import TreeChart from "vue-tree-chart";
import Echarts from "@/components/Echarts/index.vue";

@Component({
  components: {
    TreeChart,
    Echarts,
  },
})
export default class Extension extends Vue {
  /**
   *  @name[String]      节点名称
   *  @image_url[String] 节点图片
   *  @children[Array]   节点后代
   *  @mate[Object]      节点配偶
   */
  private treeData: any =   {
    id: 1,
    name: 'root',
    image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9",
    children: [
      {
        id: 2,
        name: 'children1',
        image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
      },
      {
        id: 3,
        name: 'children2',
        image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9",
        mate: {
          id: 5,
          name: 'mate',
          image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
        },
        children: [
          {
            id: 6,
            name: 'grandchild',
            image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
          },
          {
            id: 7,
            name: 'grandchild2',
            image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
          },
          {
            id: 8,
            name: 'grandchild3',
            image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
          }
        ]
      },
      {
        id: 4,
        name: 'children3',
        image_url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F08%2F22%2F1857bacff341c55.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620465550&t=018950c6719683bd7d084b88562f6ec9"
      }
    ]
  };

  private formTreeData: any = {};
  private formData: any = {
    name: '',
    id: '',
  };
  private loadingType: boolean = false;
  private drawerType: boolean = false;
  private drawerFormType: boolean = false;
  private childrenType: number = 1; 

  // 生命周期
  created() {};

  // 生命周期
  mounted() {};

  // 关闭抽屉回调
  private onDrawerClose() {
    this.drawerFormType = false;
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = ''
    });
    Object.keys(this.formTreeData).forEach(key => {
      this.formTreeData[key] = ''
    });
  }

  private onNodeClick(row) {
    const obj = deepCloneData(row);
    this.drawerType = true;
    this.formTreeData = obj;
    // console.log(val);
  }

  private onChildrenClick(id) {
    const obj = deepCloneData(this.formTreeData);
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = ''
    });
    this.childrenType = id;
    if(id !== 3) this.drawerFormType = true;
    else this.drawerFormType = false;
    if(id === 2) this.formData = obj;
  }

  private submitForm(formName) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    this.loadingType = true;
    ref.validate((valid) => {
      if (valid) {
        this.onDialogFormClick();
      } else {
        this.loadingType = false;
        console.log('error submit!!');
        return false;
      }
    });
  }

  private onDialogFormClick(){

  }
}
</script>
<style lang="scss" scoped>
.container {
  min-height: 800px;
}
.v-tooltip-box {
  padding-bottom: 30px;
  .v-icon {
    display: inline-block;
    color: #666;
    span {
      display: inline-block;
      padding-left: 3px;
      vertical-align: middle;
    }
  }
  .el-icon-question {
    font-size: 16px;
    vertical-align: middle;
  }
}
.v-header-mian {
  padding: 15px;
  color: #333;
}
.v-text-mian {
  padding: 15px;
  border-top: 1px solid #eee;
  .v-text {
    padding: 10px 0;
    font-size: 0;
    span {
      display: inline-block;
      min-width: 60px;
      vertical-align: middle;
      font-size: 14px;
    }
  }
  .v-button-box {
    padding-top: 30px;
  }
}
.v-form-box {
  padding: 15px 50px 15px 0;
  .v-btn-box {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
