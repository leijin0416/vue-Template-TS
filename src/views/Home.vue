<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <el-row>
            <el-col :span="12">
                <Test />
                <p>obj: {{obj}}</p>
            </el-col>
            <el-col :span="12">
                <Hello :msg="obj" />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'vue-property-decorator';
import { Test, Hello } from "@/components";
import { sessionData } from '@/filters/storage';
import { webGetSelectAreaCode } from '@/api/index';

@Component({
    components: {
        Test,
        Hello
    },
})
export default class Home extends Vue {
    // data 父传子 Prop
    obj:string = '123333';

    // 生命周期
    mounted () {
        this.getApiData();
    }
    getApiData() {
        webGetSelectAreaCode({
            'pageNum': 1,
            'pageSize': 223
        }).then( res => {
            console.log(res);
        })
    }
}
</script>
