<template>
    <div class="test-wrap">
        <p>state: {{author}}</p>
        <p class="text">{{data.componentName}}</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { TestData } from '@/types/components/test.interface';
import {
    State,
    Getter,
    Action,
    Mutation,
    namespace,
} from 'vuex-class';
const someModule = namespace('indexVUEX');

@Component({
})
export default class About extends Vue {
    @someModule.State(state => state.author) author:any
    // prop
    @Prop({
        required: false,
        default: ''
    }) name!: string
    
    // data
    data: TestData = {
        componentName: 'test'
    }
    created() {
        console.log(this.author)
    }
    activated() {
        //
    }
    mounted() {
        //
    }
}
</script>

<style lang="scss" scoped>
.test-wrap {
    width: 100%;
}
</style>