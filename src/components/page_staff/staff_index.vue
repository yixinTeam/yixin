<template>
    <div class="container">
        <div class="part1">
            <p>今日剩余任务</p>
            <ul>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.taskNum}}</p>
                    <p class="grey">外呼任务</p>
                </li>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.toCallUserNum}}</p>
                    <p class="grey">待呼叫人数</p>
                </li>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.subscribeTodayNum}}</p>
                    <p class="grey">今日已预约</p>
                </li>
                <li :style="{'float':'right'}">
                    <router-link :to="{path:'/staff/stage'}">
                    <el-button type="info" size="small" :style="{'margin-top':'1em'}">开始呼叫工作</el-button>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="part2">
            <p>今日完成情况</p>
            <ul>
                <li>
                    <p class="black">{{todayCompleteDto.calledNumTotal}}</p>
                    <p class="grey">已呼人数</p>
                </li>
                <li>
                    <p class="black">{{todayCompleteDto.calledDuration}}</p>
                    <p class="grey">已呼时长(min)</p>
                </li>
                <li>
                    <p class="black">{{todayCompleteDto.successNum}}</p>
                    <p class="grey">发展成功</p>
                </li>
                <li>
                    <p class="black">{{todayCompleteDto.failureNum}}</p>
                    <p class="grey">发展失败</p>
                </li>
                <li>
                    <p class="black">{{todayCompleteDto.progressingNum}}</p>
                    <p class="grey">继续跟进</p>
                </li>
                <li>
                    <p class="black">{{todayCompleteDto.calledNumTotal==0?0:(todayCompleteDto.successNum/todayCompleteDto.callNumTotal*100)}}%</p>
                    <p class="grey">成功率(成功/已呼)</p>
                </li>
            </ul>
        </div>
        <div class="part3">
            <div class="p2_tit">
                <p>进行中任务</p>
                <router-link :to="{path:'/staff/follow'}">
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
                </router-link>
            </div>
            <div class="svg"></div>
            <div class="svg"></div>
            <div class="svg"></div>
            <div class="svg"></div>
        </div>
    </div>
</template>
<style scoped>
    .part1,.part2,.part3{
        text-align: left;
        padding-left: 5vw;
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }
    .part1 li{
        width: 16%;
        text-align: center;
        float: left;
        padding-right: 5vw;
        box-sizing: border-box;
    }
    .part2 li{
        width: 16%;
        text-align: center;
        float: left;
        padding-right: 5vw;
        box-sizing: border-box;
    }
    .part2{
        max-height: 290px;
    }
    ul{
        padding: 0;
        overflow: hidden;
    }
    li{
        list-style: none;
    }
    .grey{
        color: #999;
        font-size: 12px;
    }
    .black{
        color: #444;
        font-size: 18px;
    }
    .p2_tit{
        overflow: hidden;
    }
    .p2_tit>p:nth-child(1){
        float: left;
    }
    .p2_tit>a>p{
        float: right;
    }
    .p3_tit{
        overflow: hidden;
    }
    .p3_radio{
        float: left;
        margin: 20.67px 20px;
        font-size: 14px;
    }
    .p3_tit>p:nth-child(1){
        float: left;
    }
    .p3_tit>p.grey{
        float: right;
    }
    .svg{
        width: 25%;
        height: 230px;
        float: left;
    }
    .svg_work{
        width: 49%;
        height: 300px;
        float: left;
    }
</style>

<script>
let echarts = require('echarts/lib/echarts');
// 引入饼图组件
require('echarts/lib/chart/pie')
// 引入提示框和图例组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
export default {
    name:'Staff_index',
    data:function(){
        return {
            mission_data:[],
            datas:{
                "seatTaskLeftTodayDto" : {
                    "subscribeTodayNum" : 0,
                    "taskNum" : 0,
                    "toCallUserNum" : 0
                }
            },
            todayCompleteDto : {
                "callTalkedNumToal" : 0,
                "callTalkedTotal" : 0,
                "calledDuration" : 0,
                "calledNumTotal" : 0,
                "calledTotal" : 0,
                "failureNum" : 0,
                "progressingNum" : 0,
                "successNum" : 0
            }
        }
    },
    methods:{
        drawPie:function(item){
            console.log(item);
            var myChart = echarts.init(document.getElementsByClassName('svg')[item.id_num]);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    x: 'left',
                    data:['发展成功','发展失败','继续跟进'],
                    show:item.show_tit
                },
                title:{
                    text:item.id,
                    bottom:'0px',
                    left:'center',
                    textStyle:{
                        fontSize:14,
                        color:'#999'
                    }
                },
                series: [
                    {
                        name:'客户状态',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:item.data
                    }
                ]
            };
            myChart.setOption(option);
        },
        change:function(){
            
        },
        date_init(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'-'+month+'-'+day;
        },
        mission_init:function(item){
            for(let i=0;i<4;i++){
                if(i<item.length){
                    let obj={'id_num':i,'id':item[i].taskName,'key':item[i].taskId,data:[{'name':'发展成功','value':item[i].successNum},{'name':'发展失败','value':item[i].failureNum},{'name':'继续跟进','value':item[i].processingNum}]}
                    this.drawPie(obj);
                }
            }
        }
    },
    //初始化首页数据
    mounted(){
        var _this=this;
        var beginTime=this.date_init(new Date(new Date().getTime() - 1*24*60*60*1000));
        var endTime=this.date_init(new Date());
        this.$ajax.post(this.$preix+'/new/getIndexData'
        ).then( res=>{
        if(res.data.code==200){
                _this.datas=res.data.info;
                console.log(res.data.info)
            }
        });
        this.$ajax.post(this.$preix+'/new/calltask/queryTaskOnwallChartBySeat'
        ).then( res=>{
            if(res.data.code==200){
                _this.mission_init(res.data.info);
            }
        });
        this.$ajax.post(this.$preix+'/new/callstatistics/querySeatTaskCompletion',{beginTime:beginTime,endTime:endTime}
        ).then( res=>{
            if(res.data.code==200&&res.data.info){
                _this.todayCompleteDto=res.data.info;
            }
        });
    }
}
</script>

