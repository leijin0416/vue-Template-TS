<template>
  <p>404</p>
</template>

<script lang="ts">
import { Component, Inject, Provide, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { removeHTMLTag } from '@/filters/index';

@Component({
  components: {
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