<template>
    <el-dialog :title="title[type].tit" :visible.sync="show" @close="close" center>
        <div :style="{'text-align':'left'}">{{title[type].con}}</div>
        <div class="con">

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show=false">&#12288;关闭&#12288;</el-button>
        </span>
      </el-dialog>
</template>
<style scoped>
    .con{
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 40vh;
    }
    .con>ul{
        box-sizing: border-box;
    }
    .con::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .con::-webkit-scrollbar
    {
        width: 3px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .con::-webkit-scrollbar-thumb
    {
        background-color: #8b8b8b;
        border-radius: 1px;
    }
</style>
<script>
export default {
    name:"dialog_worker",
    data:function(){
        return{
            title:[{
                tit:'复制信息',con:'复制坐席信息给销售人员，让他开始工作吧！'
            },{
                tit:'重置密码',con:'坐席密码已重置，您可以复制新的坐席信息给销售人员'
            }]
        }
    },
    props:["message","type","show"],
    computed:{
        messages:function(){
            return this.message;
        }
    },
    methods:{
        close:function(){
            this.$emit("reset");
        }
    }
}
</script>
