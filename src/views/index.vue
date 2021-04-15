<template>
  <div class="page">
    <div class="v-img-box">
      <img src="@/assets/img/icon-welcome.jpg" alt="home.png" class="v-img reveal-top" >
    </div>
  </div>
</template>

<script lang="ts">
import scrollReveal from 'scrollreveal';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { TreeForeach, scrollRevealEffect } from '@/filters/common';
import { sessionData } from '@/filters/storage';

@Component({
  components: {},
})
export default class UserList extends Vue {
  // 动画
  private scrollReveal = scrollReveal();
  private obj: string = '123333';

  // 生命周期
  mounted () {
    let revealTop = scrollRevealEffect(300, 'right', false, false, '600px');
    this.scrollReveal.reveal('.reveal-top', revealTop);
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
