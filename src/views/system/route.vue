<template>
  <div class="container">
    <el-row>
      <el-col :span="8">
        <ElTree />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Provide, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { removeHTMLTag } from '@/filters/index';


import ElTree from "@/components/ElTree/index.vue";

@Component({
  components: {
    ElTree,
  },
})
export default class Index extends Vue {
  mounted () {
    this.Hello();
  }
  created () {
    console.log('object :>> ', '123');
  }
  Hello () {
    let dd = removeHTMLTag("<script>dd&nbsp/123*** <12script>");
    console.log(dd);
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 800px;
}
</style>