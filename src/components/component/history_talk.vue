<template>
    <div class="container">
        <div class="head">历史通话记录<i class="el-icon-close" @click="close"></i></div>
        <div id="line" v-if="!head"></div>
        <div class="body" v-if="head">
            <div class="mes2">
                <p>{{name}}</p>
                <p>{{phone}}</p>
            </div>
            <div class="mes">
                <p>性别：{{sex}}</p>
                <p>职业：{{job}}</p>
                <p>公司：{{company}}</p>
                <p>邮箱：{{email}}</p>
                <p>意向：{{think}}</p>
            </div>
        </div>
        <div class="history">
            <div class="line"></div>
            <div class="record">
                <div class="record_list black" v-for="(item,index) in details" :key="index">
                    <p class="grey">{{item.callEndTime}}</p>
                    {{item.shortName}} <span class="black">{{item.callReault==22?'呼叫':'通话'}}</span> {{item.callReault==22?item.callReaultString:item.callDuration}}
                    <div class="line_content">
                        <p class="grey" v-if="item.userResultStr">客户状态&#12288;<span class="black">{{item.userResultStr}}</span></p>
                        <p class="grey" :style="{'float':'right'}">下次联系时间&#12288;<span class="black">{{item.nextContactTime?item.nextContactTime:'无'}}</span></p>
                        <p class="grey" v-if="item.desc">详情备注&#12288;<span class="black">{{item.desc}}</span></p>
                        <el-button type="info" size="mini" v-if="item.tags!=undefined" v-for="(_item,index) in taglist" :key="index">{{_item}}</el-button>
                        <p class="grey" :style="{'width':'100%'}">通话录音&#12288;
                            <audio controls>
                            <source src="/statics/demosource/horse.ogg" type="audio/ogg">
                            <source src="/statics/demosource/horse.mp3" type="audio/mpeg">
                            您的浏览器不支持 audio 元素。
                            </audio>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    #line{
        width: 100%;
        height: 1px;
        background-color: #e4e4e4;
    }
    div{
        
        font-size: 13px;
    }
    .container{
        width: 30vw;
        overflow: hidden;
        height: 100vh;
        min-width: 400px;
    }
    .head{
        margin: 10px 0;
    }
    .body{
        background-color: #f5f5f5;
    }
    .el-icon-close{
        float: right;
    }
    .mes2{
        overflow: hidden;
        margin: 10px;
        text-align: left;
        border-bottom: 1px solid #ccc;
    }
    .mes{
        overflow: hidden;
        padding: 10px 0;
        text-align: left;
    }
    .mes p{
        float: left;
        margin:0 10px;
    }
    .history{
        position: relative;
        margin-top: 12px;
    }
    .line{
        width: 1px;
        background-color: #ccc;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 8px;
    }
    .record{
        width: 30vw;
        min-width: 400px;
        position: absolute;
        top: 0;
        left: 0;
        padding-left: 18px;
        box-sizing: border-box;
        margin: 4px 0;
        background: transparent;
        overflow-y: auto;
        max-height: 90vh;
    }
    .record p{
        margin: 4px 0;
    }
    .record_list{
        position: relative;
        text-align: left;
        padding-left: 8px;
        padding-right: 8px;
        margin-bottom: 16px;
    }
    .record_list::before{
        content: '';
        position: absolute;
        top: 0;
        left: -16px;
        width: 15px;
        height: 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 100%;
        background-color: #fff;
    }
    .record::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .record::-webkit-scrollbar
    {
        width: 4px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .record::-webkit-scrollbar-thumb
    {
    background-color: #8b8b8b;
    border-radius: 1px;
    }
    .line_content{
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 7px;
        margin: 8px 0;
    }
    .line_content p{
        float: left;
    }
</style>
<script>
export default {
    name:'history_talk',
    data:function(){
        return {
            name:'未知客户',
            phone:'13933337767',
            sex:'女',
            job:'设计师',
            company:'网易(杭州)网络有限公司',
            email:'hzfuwenjuan@corp.nete',
            think:'待添加'
        }
    },
    props:['head','details'],
    computed:{
        taglist:function(){
            var arr=[];
            this.details.map(function(item){
                if(item.tags!=undefined){
                    //arr.push(item.tags.lastTagValue.split(';'));
                }
            });
            return arr;
        }
    },
    methods:{
        close(){
            this.$emit('close')
        }
    }
}
</script>

