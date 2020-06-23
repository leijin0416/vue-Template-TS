<template>  
    <div>
        <input v-model="msg">
        <p>msg: {{ msg }}</p>
        <p>computed msg: {{ computedMsg }}</p> 
        <button @click="greet">Greet</button>  
    </div>
</template>
    
<script lang="ts">
import { Component, Inject, Provide, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { removeHTMLTag } from '@/filters/index';

export default class Index extends Vue {
    mounted () {
        this.Hello()
        console.log('mounted');
    }
    Hello () {
        let dd = removeHTMLTag("<scrisspt>d&nbsp&nbsp&nbspd");
        console.log(dd);
    }
}
</script>