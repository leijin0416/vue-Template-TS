<template>
  <!-- 推广列表 -->
  <div class="container">
    推广图
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { MessageTips } from '@/filters/MessageTips';
import { sessionData } from '@/filters/storage';

@Component({
  components: {},
})
export default class UserList extends Vue {
  private tagsList: any = [];
  private obj: string = '123333';

  // 生命周期
  created() {
  }

  // 生命周期
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.container {
  min-height: 800px;
}
</style>
