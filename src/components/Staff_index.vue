<template>
    <div class="container">
        <div class="part1">
            <p>今日剩余任务</p>
            <ul>
                <li>
                    <p class="black">4</p>
                    <p class="grey">外呼任务</p>
                </li>
                <li>
                    <p class="black">233</p>
                    <p class="grey">待呼叫人数</p>
                </li>
                <li>
                    <p class="black">8</p>
                    <p class="grey">今日已预约</p>
                </li>
            </ul>
        </div>
        <div class="part2">
            <p>今日完成情况</p>
            <ul>
                <li>
                    <p class="black">88</p>
                    <p class="grey">已呼人数</p>
                </li>
                <li>
                    <p class="black">240</p>
                    <p class="grey">已呼时长(min)</p>
                </li>
                <li>
                    <p class="black">8</p>
                    <p class="grey">发展成功</p>
                </li>
                <li>
                    <p class="black">60</p>
                    <p class="grey">发展失败</p>
                </li>
                <li>
                    <p class="black">20</p>
                    <p class="grey">继续跟进</p>
                </li>
                <li>
                    <p class="black">9.01%</p>
                    <p class="grey">成功率(成功/已呼)</p>
                </li>
            </ul>
        </div>
        <div class="part3">
            <div class="p2_tit">
                <p>进行中任务</p>
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
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
    .p2_tit>p:nth-child(2){
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
            mission_data:[]
        }
    },
    mounted() {
        this.mission_init([
            {id_num:'0',id:'武林业主',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:135, name:'继续跟进'}]},
            {id_num:'1',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:135, name:'继续跟进'}]},
            {id_num:'2',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:135, name:'继续跟进'}]},
            {id_num:'3',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:135, name:'继续跟进'}]}
        ])
    },
    computed:{
        mission:{
            get: function () {
                return this.mission_data;
            },
            set: function (newValue) {
                for(var i=0;i<4;i++){
                    this.drawPie(newValue[i]);
                };
            }
        }
    },
    methods:{
        drawPie:function(item){
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
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                },
                                formatter: "{b}({d}%)"
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
        mission_init:function(value){
            this.mission=value;
            this.mission_data=value;
        }
    }
}
</script>

