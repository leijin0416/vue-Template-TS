<template>
  <div class="page">
    <div class="v-img-box">
      <img src="@/assets/img/icon-welcome.jpg" alt="home.png" class="v-img" >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { sessionData } from '@/filters/storage';

@Component({
  components: {},
})
export default class UserList extends Vue {
  private tagsList: any = [];
  private obj: string = '123333';

  // 生命周期
  mounted () {
  };
}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 800px;
  background-color: #fff;
  .v-img-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .v-img {
      display: block;
    }
  }
}
</style>
