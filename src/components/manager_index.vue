<template>
    <div class="container">
        <div class="part1">
            <p>通话资源及坐席概况</p>
            <ul>
                <li>
                    <p class="grey">剩余通话资源</p>
                    <p class="grey"><span class="black">{{time.remin}}分钟</span>/{{time.all}}分钟</p>
                    <el-progress :percentage="time_scale" :show-text='false' :status='time_scale>20?"success":"exception"'></el-progress>
                </li>
                <li>
                    <p class="grey">企业坐席</p>
                    <p class="grey"><span class="black">{{worker.num}}人</span>/{{worker.all}}人</p>
                    <el-progress :percentage="worker_scale" :show-text='false' :status='time_scale>20?"success":"exception"'></el-progress>
                </li>
            </ul>
        </div>
        <div class="part2">
            <div class="p2_tit">
                <p>外呼任务完成情况</p>
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
            </div>
            <div class="svg"></div>
            <div class="svg"></div>
            <div class="svg"></div>
            <div class="svg"></div>
        </div>
        <div class="part3">
            <div class="p3_tit">
                <p>坐席呼叫统计</p>
                <el-radio-group v-model="time_past" class="p3_radio" @change="change">
                    <el-radio :label="1">过去24小时</el-radio>
                    <el-radio :label="2">过去7天</el-radio>
                    <el-radio :label="3">过去30天</el-radio>
                </el-radio-group>
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
            </div>
            <div class="svg_work"></div>
            <div class="svg_work"></div>
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
        width: 50%;
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
  require('echarts/lib/chart/bar')
  // 引入提示框和图例组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
export default {
    name:'manager_index',
    data:function(){
        return {
            time:{remin:'300',all:'1000'},
            worker:{num:'8',all:'10'},
            mission_data:[],
            time_past:'',
            worker_time_data:[],
            worker_person_data:[],
            mission_data:[]
        }
    },
    mounted() {
        this.mission_init([
                {id_num:'0',id:'武林业主',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'1',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'2',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'3',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]}
           ])
        this.worker_time_init([{'name':'巴西','value':50},{'name':'印尼','value':20},{'name':'美国','value':300},{'name':'印度','value':200},{'name':'中国','value':100}]);
        this.worker_person_init([{'name':'巴西','value':500,'success':200,'fail':100,'doing':200},{'name':'印尼','value':120,'success':50,'fail':20,'doing':50},{'name':'美国','value':300,'success':80,'fail':100,'doing':120},{'name':'印度','value':200,'success':20,'fail':110,'doing':70},{'name':'中国','value':100,'success':20,'fail':20,'doing':60}]);
    },
    computed:{
        time_scale:function(){
            return (this.time.remin/this.time.all)*100
        },
        worker_scale:function(){
            return (this.worker.num/this.worker.all)*100
        },
        worker_time:{
            get: function () {
                return this.worker_time_data;
            },
            set: function (newValue) {
                this.drawLine(newValue);
            }
        },
        worker_person:{
            get: function () {
                return this.worker_person_data;
            },
            set: function (newValue) {
                this.drawLines(newValue);
            }
        },
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
                    data:['发展成功','发展失败','未分配','继续跟进'],
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
                                    fontSize: '15',
                                    fontWeight: 'bold'
                                }
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
        drawLine:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg_work')[0]);
            var compare = function (obj1, obj2) {
                var val1 = obj1.value;
                var val2 = obj2.value;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            } 
            item.sort(compare);
            var arr_person=[];
            var arr_time=[];
            for(let i=0;i<item.length;i++){
                arr_person.push(item[i].name)
                arr_time.push(item[i].value)
            }
            var option = {
                title: {
                    text: '坐席呼叫时长(min)',
                    bottom:'0px',
                    left:'left',
                    textStyle:{
                        fontSize:14,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '6%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine:{show: false}
                },
                yAxis: {
                    type: 'category',
                    data: arr_person
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(153, 153, 153, 1)'
                            }
                        },
                        data: arr_time
                    }
                ]
            };
            myChart.setOption(option);
        },
        drawLines:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg_work')[1]);
            var compare = function (obj1, obj2) {
                var val1 = obj1.value;
                var val2 = obj2.value;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }            
            } 
            item.sort(compare);
            var arr_person=[];
            var arr_success=[];
            var arr_fail=[];
            var arr_doing=[];
            for(let i=0;i<item.length;i++){
                arr_person.push(item[i].name)
                arr_success.push(item[i].success)
                arr_fail.push(item[i].fail)
                arr_doing.push(item[i].doing)
            }
            var option = {
                title: {
                    text: '坐席通话人数',
                    bottom:'0px',
                    left:'left',
                    textStyle:{
                        fontSize:14,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                legend: {
                    data:['发展成功', '发展失败','继续跟进'],
                    bottom:0,
                    left:'right',
                    itemWidth:15,
                    itenHeight:15,
                    pageTextStyle:{
                        fontSize:14,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                calculable : true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '6%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine:{show: false}
                },
                yAxis: {
                    type: 'category',
                    data: arr_person
                },
                series: [
                    {
                        type: 'bar',
                        name:'发展成功',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(120, 185, 153, 1)'
                            }
                        },
                        data: arr_success
                    },
                    {
                        type: 'bar',
                        name:'发展失败',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(217, 120, 120, 1)'
                            }
                        },
                        data: arr_fail
                    },{
                        type: 'bar',
                        name:'继续跟进',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(153, 153, 153, 1)'
                            }
                        },
                        data: arr_doing
                    }
                ]
            };
            myChart.setOption(option);
        },
        change:function(){
            
        },
        worker_time_init:function(value){
            this.worker_time=value;
            this.worker_time_data=value;
        },
        worker_person_init:function(value){
            this.worker_person=value;
            this.worker_person_data=value;
        },
        mission_init:function(value){
            this.mission=value;
            this.mission_data=value;
        }
    }
}
</script>

