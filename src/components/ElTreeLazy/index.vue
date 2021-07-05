<template>
  <!-- 树状图动态加载节点 -->
  <div class="v-tree-main" ref="treeMain">
    <div class="v-btn-box">
      <el-button icon="el-icon-refresh" size="small" class="v-btn" @click="onInfoUpdateClick" >{{$t('手动扩展')}}</el-button>
    </div>

    <div class="v-tree" v-if="lazyType">
      <el-tree
        ref="tree"
        :props="defaultProps"
        :load="loadNode"
        lazy
        accordion
        :show-checkbox="false"
        :check-strictly="true"
        :highlight-current="true"
        @check-change="checkChange"
        node-key="userId"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="v-title">
            <i :class="data.isSponsor ? 'el-icon-folder-opened' : 'el-icon-folder' "></i> {{ node.label }}
          </span>
          BV
          <span>
            {{ data.leftBv }} / {{ data.rightBv }}
          </span> 
          
          <span class="v-tag-box">
            {{ data.levelName ? data.levelName : '0 Star' }}
          </span> 
        </span>
      </el-tree>
    </div>
    <!-- 可屏蔽 load、lazy，设置 :data -->
    <div class="v-tree-box" v-else>
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="treeData"
        accordion
        :check-strictly="true"
        show-checkbox
        @check-change="checkChange"
        node-key="userId"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <i :class="data.icon"></i> {{ node.label }} 
          </span>              
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { FormatCurrentTime, deepCloneData } from '@/filters/common';
import { UserListStore } from '@/store/private/PageUserList';

interface DefaultProps {
  children: any;
  label: string;
  sponsorId: string;
  isLeaf: any;
}

@Component({
  components: {
  },
})
export default class userGrade extends Vue {
  private lazyType: boolean = true;
  private rootNode: any = '';
  private rootResolve: any = '';
  private userIdMap: any = [];     // id集合

  private totalCount: number = 1;       // 表格总数
  private treeChildrenData: any = [];  // 数据
  private treeData: any = [];         // 数据
  private treeHomeData: any = [];         // 数据

  private selectOrg: any = {  // 选择框
    orgJsn: {}, //存唯一的值，勾选的
    orgsid: [], //存id，与node-key相结合
  }
  private defaultProps: DefaultProps = {
    children: 'children',
    label: "userName",
    isLeaf: "leaf",
    sponsorId: "sponsorId",
    // disabled: "isSponsor",  //还可以使用disabled控制节点是否能被选择
  };


  // 获取数据
  get getUserSponsorTreeList() {
    return
  };
  get getUserSponsorIdsTreeList() {
    return
  };

  // 监听数据列表
  @Watch('getUserSponsorTreeList', { deep: true })
  userPageChange(newValue) {    // 第一次查
    this.startLoading();
    if(newValue.message == '0') {
      this.treeHomeData = [];
      this.resetNode();

    } else {
      this.treeHomeData.push(newValue.data);
      this.userIdMap.push(newValue.data);
    }
    // console.log(newValue)
  };
  @Watch('getUserSponsorIdsTreeList', { deep: true })
  userSponsorIdsTreeList(newValue) {   // 第二次查
    // console.log(newValue)
    const {data} = newValue;
    if(data.length > 0) {
      data.forEach( el => {
        if(!el.isSponsor) el.leaf = true;   // 没有下层数据了
      });
      this.$nextTick(function() {
        this.treeChildrenData = data;
        this.userIdMap = data;
      })
    }
  };

  // 生命周期
  created() {};

  // 生命周期
  mounted () {};

  // loading
  private startLoading() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)',
    });
    return loading;
  }

  // 结束 loading
  private endLoading(loading) {
    loading.close();
  }

  // 刷新
  private resetNode(){
    var theChildren = this.rootNode.childNodes;
    theChildren.splice(0, theChildren.length);
    this.loadNode(this.rootNode, this.rootResolve);
  }

  // 手动扩展
  private onInfoUpdateClick() {
    let data = this.userIdMap;
    data.forEach( el => {
      this.rootNode.id = el.userId;
      this.rootNode.level = el.userId;
      this.dd(this.rootNode, this.rootResolve);
    });
    // console.log(this.userIdMap);
  }
  dd(node, resolve) {
    let userIdsMap: any = [];
    let data = this.userIdMap;
    data.forEach( el => {
      userIdsMap.push(el.userId)
    });
    let params = {
      userId: '',
      userName: '',
      tree: 2,
      sponsorId: userIdsMap.toString()
    }
    // UserListStore.storeActionUserSponsorTreeList(params)   // 第一次查

    setTimeout(() => {
      let res = this.treeChildrenData;
      resolve(res);
    }, 1000);
  }
  
  /**
   * @description:  树组件动态加载子树数据事件
   * @param {*} node
   * @param {*} resolve
   * @return {*}
   */
  private loadNode(node, resolve) {
    // console.log(node);
    // console.log(resolve);
    if (node.level === 0) {
      this.rootNode = node;
      this.rootResolve = resolve;
      // 这里适合去做数据请求，获取到树状图数据
      // node.level === 0 是初始化树状图最开始就展示的数据
      setTimeout(() => {
        this.endLoading(this.startLoading());
        let res = this.treeHomeData;
        resolve(res);   // 第一次查

      }, 1000);

    } else {
      // 这里适合去做数据请求，获取到树状图数据 （为实现loading效果，添加了定时器）
      const params = {
        userId: '',
        userName: '',
        tree: 2,
        sponsorId: node.data.userId
      }
      // UserListStore.storeActionUserSponsorTreeList(params)   // 第二次查

      setTimeout(() => {
        let res = this.treeChildrenData;
        resolve(res);
      }, 2000);
    }
        
  }

  // 设置复选框为单选的  
  private checkChange(data, checked) {
    // console.log(data);

    // 获取当前选择的id在数组中的索引
    const indexs = this.selectOrg.orgsid.indexOf(data.userId);
    // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
    if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
      // 设置已选择的节点为false 很重要
      this.$nextTick(function() {
        const ref: any = this.$refs.tree;
        ref.setChecked(this.selectOrg.orgJsn, false); //设置之前选中的为未选中
        this.selectOrg.orgsid = []; //清空
        this.selectOrg.orgsid.push(data.userId); //存唯一的node-key中唯一的标致 id
        this.selectOrg.orgJsn = data; //存当前节点的json
      })

    } else if (this.selectOrg.orgsid.length === 0 && checked) {
      // 发现数组为空 并且是已选择
      // 防止数组有值，首先清空，再push
      this.$nextTick(function() {
        this.selectOrg.orgJsn = data;
        this.selectOrg.orgsid = [];
        this.selectOrg.orgsid.push(data.userId);
      })
      
    } else if (
      indexs >= 0 &&
      this.selectOrg.orgsid.length === 1 &&
      !checked 
    ) {
      // 再次直接进行赋值为空操作
      this.selectOrg.orgsid = [];
    }
  }
}
</script>

<style lang='scss' scoped>
.v-tree-main {
  min-height: 500px;
}
.v-btn-box {
  margin-bottom: 30px;
}
.v-title {
  font-weight: bold;
}
.v-tag-box {
  display: inline-block;
  padding: 4px 10px;
  font-weight: bold;
  border-radius: 5px;
  transform: scale(.8);
  color: #777;
  background-color: #eee;
}
</style>