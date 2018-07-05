<template>
    <div class="container">
        <div class="part1">
            <div class="part1_show">
                <div class="svg"></div>
                <div class="svg"></div>
                <div class="svg"></div>
                <div class="svg"></div>
            </div>
            <div class="part1_nav">
                <p class="grey">选择展示任务</p>
                <el-checkbox-group v-model="checkedlist" :min="0" :max="4" class="ul" @change='change'>
                    <el-checkbox v-for="item in position" :label="item.key" :key="item.key" class="li">{{item.value}}</el-checkbox>
                </el-checkbox-group>
                <el-button type="info" plain class="part1_button">确定</el-button>
            </div>
        </div>
        <div class="part2">
            <div class="part2_tit">
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="info" class="button" :style="{float:'left'}">搜索</el-button>
                <el-button type="info" plain class="button">导出当前结果</el-button>
                <el-button type="info"  class="button" @click="lead_in">导入客户</el-button>
                <Dialog v-bind:leading="leading" @reset="reset"></Dialog>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">可见状态</p>
                    <p class="black" :class="{see_active:see_state=='all'}" @click="see_change('all')">所有人可见</p>
                    <p class="black" :class="{see_active:see_state=='manager'}" @click="see_change('manager')">仅管理员可见</p>
                </div>
                <div>
                    <p class="grey">创建时间</p>
                    <el-date-picker
                    v-model="search_date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <el-tag type="info" class="tag" v-if="search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column label="任务名称" class-name="line1" label-class-name="line1_tit" sortable :show-overflow-tooltip=true min-width="120">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./detail', query: { id: '111' }}">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="p_all" label="总客户" class-name="line2" sortable  :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="p_fenpei" label="已分配" class-name="line3" sortable :show-overflow-tooltip=true > </el-table-column>
                <el-table-column prop="p_hu" label="已呼" class-name="line4" sortable :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="p_success" label="成功" class-name="line5" sortable :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="p_fail" label="失败" class-name="line6" sortable :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="p_doing" label="跟进" class-name="line7" sortable :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="p_biaoqian" label="关联客户标签" class-name="line8" sortable :show-overflow-tooltip=true min-width="150"> </el-table-column>
                <el-table-column prop="p_time" label="创建时间" class-name="line9" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_see" label="可见状态" class-name="line10" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlefp(scope.$index, scope.row)">分配客户</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handlefr(scope.$index, scope.row)">导入客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="1000">
            </el-pagination>
        </div>
        <assign v-bind:assign="assign" :total='p_assign' @reset="reset"></assign>
    </div>
</template>
<style scoped>
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
        font-size: 12px;
    }
    .part1{
        padding-left: 3vw;
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }
    .part1>div{
        float: left;
    }
    .part1_show{
        width: 80%;
        float: left;
    }
    .part1_button{
        padding: 4px 12px;
        font-size: 12px;
        float: right;
        margin: 14px 10px 5px 0;
    }
    .svg{
        width: 25%;
        height: 200px;
        float: left;
    }
    .part1_nav{
        width: 20%;
        float: left;
        border-left: 1px solid #eee;
        box-sizing: border-box;
    }
    .ul{
        height: 140px;
        overflow-y: scroll
    }
    .ul .li{
        margin: 5px 0;
    }
    .ul::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .ul::-webkit-scrollbar
    {
    width: 3px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .ul::-webkit-scrollbar-thumb
    {
    background-color: #8b8b8b;
    border-radius: 1px;
    }
    .part2_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .search{
        float: left;
        width: 200px;
        font-size: 12px;
    }
    .part2_tit .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
    }
    .zhankai{
        background-color: rgba(242, 242, 242, 1);
        text-align: left;
        overflow: hidden;
    }
    .zhankai>div{
        overflow: hidden;
        margin: 10px 0;
    }
    .zhankai>div>p{
        float: left;
        padding: 4px 2px;
    }
    .zhankai>div>p.grey{
        margin: 0 14px;
    }
    .zhankai>div>p.black{
        margin: 0 10px;
    }
    .see_active{
        background-color: rgba(153, 153, 153, 1);
        color: #fff;
    }
    .tag{
        background-color: rgba(153, 153, 153, 1);
        color: #fff;
        font-size: 12px;
        border-radius: 0;
        height: 26px;
        line-height: 26px;
    }
    .date_picker{
        position: relative;
    }
    .zhankai .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin-top: 10px;
    }
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }

</style>

<script>
let echarts = require('echarts/lib/echarts')
  // 引入饼图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和图例组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  import Dialog from "./component/dialog.vue"
  import assign from "./component/dialog_assign.vue"
export default {
    name:'missoin_follow',
    data:function(){
        return {
            missoin_data:[],
            position:[{'value':'和平广场展会','key':'1'},{'value':'和平广场展会','key':'2'},{'value':'和平广场展会','key':'3'},{'value':'和平广场展会','key':'4'},{'value':'和平广场展会','key':'5'},{'value':'和平广场展会','key':'6'},{'value':'和平广场展会','key':'7'},{'value':'和平广场展会','key':'8'},{'value':'和平广场展会','key':'9'}],
            checkedlist:[],
            search:'',
            search_state:false,
            see_state:'all',
            search_date:[],
            leading:false,
            assign:false,
            p_assign:'',
            tableData: [{
            name: '王小虎和他的朋友',
            p_all: '500',
            p_fenpei:'400',
            p_hu:'200',
            p_success:'80',
            p_fail:'100',
            p_doing:'20',
            p_biaoqian:'是否重点跟进；大头；钱多',
            p_time:'2018/6/11 14:23',
            p_see:'所有人可见',
            p_key:'0'
            },{
            name: '武林一号业主',
            p_all: '600',
            p_fenpei:'400',
            p_hu:'200',
            p_success:'80',
            p_fail:'100',
            p_doing:'20',
            p_biaoqian:'是否重点跟进；大头；钱多',
            p_time:'2018/6/11 14:23',
            p_see:'所有人可见',
            p_key:'1'
            },{
            name: '武林二号业主',
            p_all: '800',
            p_fenpei:'400',
            p_hu:'200',
            p_success:'80',
            p_fail:'100',
            p_doing:'20',
            p_biaoqian:'是否重点跟进；大头；钱多',
            p_time:'2018/6/11 14:23',
            p_see:'所有人可见',
            p_key:'2'
            }, {
            name: '武林三号业主',
            p_all: '500',
            p_fenpei:'400',
            p_hu:'200',
            p_success:'80',
            p_fail:'100',
            p_doing:'20',
            p_biaoqian:'是否重点跟进；大头；钱多',
            p_time:'2018/6/11 14:23',
            p_see:'所有人可见',
            p_key:'3'
            }]
        }
    },
    components:{
      Dialog,assign
    },
    computed:{
        missoin:{
            get: function () {
                return this.missoin_data;
            },
            set: function (newValue) {
                this.drawPie(newValue);
            }
        },
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
        missoin_init:function(item){
            for(var i=0;i<item.length;i++){
                this.drawPie(item[i]);
            };
        },
        change:function(){
            console.log(this.checkedlist)
        },
        see_change:function(value){
            this.see_state=value;
        },
        search_change:function(value){
            this.search_state=value;
        },
        lead_in:function(){
            this.leading = true;
            this.assign=false;
        },
        handlefp:function(index,row){
            this.assign=true;
            this.leading=false;
            this.p_assign=row.p_all-row.p_fenpei;
        },
        handledr:function(index,row){
            console.log(index,row)
        },
        reset:function(){
            this.assign=false;
            this.leading=false;
        }
    },
    mounted:function(){
        var arr=[
                {id_num:'0',id:'武林业主',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'1',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'2',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]},
                {id_num:'3',id:'和平广场',show_tit:false,data:[{value:335, name:'发展成功'},{value:310, name:'发展失败'},{value:234, name:'未分配'},{value:135, name:'继续跟进'}]}
            ]
        this.missoin_init(arr);
    }
}
</script>

