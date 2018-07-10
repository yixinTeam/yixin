<template>
    <div class="container">
        <div class="part1">
            <router-link :to="{path:'./worker'}">
                外呼任务跟踪
            </router-link>
            <i class="el-icon-arrow-right"></i>
            任务详情
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
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">客户状态</p>
                    <p class="black" v-for=" item in custom_list" :key="item.key" :class="{see_active:custom_state==item.key}" @click="custom_change(item.key)">{{item.value}}</p>
                </div>
                <div>
                    <p class="grey">跟进坐席</p>
                    <p class="black" v-for=" item in worker_list" :key="item.key" :class="{see_active:worker_state==item.key}" @click="worker_change(item.key)">{{item.value}}</p>
                </div>
                <div>
                    <p class="grey">导入时间</p>
                    <el-date-picker
                    v-model="leading_date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div>
                    <p class="grey">最近通话</p>
                    <el-date-picker
                    v-model="close_date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div>
                    <p class="grey">客户标签</p>
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" accordion>
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <p class="black see_active">客户状态：{{custom_list[custom_state].value}}</p>
                    <p class="black see_active">跟进坐席：{{worker_list[worker_state].value}}</p>
                    <el-tag type="info" class="tag" v-if="leading_date.length>0">{{'导入时间： '+leading_date[0]+'~'+leading_date[1]}}</el-tag>
                    <el-tag type="info" class="tag" v-if="close_date.length>0">{{'最近通话： '+close_date[0]+'~'+close_date[1]}}</el-tag>
                    <p class="black see_active" v-if="tag_list.length>0">客户标签：<span  v-for="item in tag_list" :key="item">{{item}}&#12288;</span></p>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="p_name" label="客户姓名" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_phone" label="手机号" class-name="line3" :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_time" label="导入时间" class-name="line4" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_state" label="客户状态" class-name="line5" :show-overflow-tooltip=true min-width="80"> </el-table-column>
                <el-table-column prop="p_worker" label="跟进坐席" class-name="line6" :show-overflow-tooltip=true min-width="80"> </el-table-column>
                <el-table-column prop="p_closest" label="最近通话" class-name="line7" :show-overflow-tooltip=true min-width="150"> </el-table-column>
                <el-table-column prop="p_biaoqian" label="客户标签" class-name="line8" :show-overflow-tooltip=true min-width="150"> </el-table-column>
                 <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlexx(scope.$index, scope.row)">详细记录</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handlefp(scope.$index, scope.row)">分配客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="1000">
            </el-pagination>
        </div>
        <transition name="slide">
            <history id="history" v-if="show"></history>
        </transition>
        
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
    .container{
        position: relative;
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
        text-align: left;
        padding: 8px;
        font-size: 14px;
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
    .custom-tree-node{
        font-size: 12px;
        color: #444;
        font-weight: 400;
        padding-right: 18px;
    }
    #history{
        position: absolute;
        right: 0;
        top: 0;
        background-color: #fff;
        box-shadow:-2px 0 5px #ccc;
    }
</style>
<style scoped>
/* .fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to  {
  transform:translateX(0%)
} */
.slide-enter-active {
  animation: slide-in 0.5s;
}
.slide-leave-active {
  animation: slide-in 0.5s reverse;
}
@keyframes slide-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>

<script>
import history from './component/history_talk.vue'
export default {
    name:'mission_detail',
    data:function(){
        return {
            show:false,
            search:'',
            search_state:false,
            custom_state:0,
            worker_state:0,
            leading_date:[],
            close_date:[],
            custom_list:[{'key':'0','value':'全部'},{'key':'1','value':'未分配'},{'key':'2','value':'持续跟进'},{'key':'3','value':'发展成功'},{'key':'4','value':'发展失败'}],
            worker_list:[{'key':'0','value':'全部'},{'key':'1','value':'牛牛'},{'key':'2','value':'华仔'},{'key':'3','value':'牛牛'},{'key':'4','value':'牛牛'}],
            tableData: [{
                p_name: '王小虎和他的朋友',
                p_phone: '13966566365',
                p_time:'2018/6/11 14:23',
                p_state:'发展成功',
                p_worker:'黄小林',
                p_closest:'17年6月11日 14:22 通话23分1秒',
                p_biaoqian:'是否重点跟进；大头；钱多',
                p_key:'0'
            },{
                p_name: '王小虎和他的朋友',
                p_phone: '13966566365',
                p_time:'2018/6/11 14:23',
                p_state:'发展成功',
                p_worker:'黄小林',
                p_closest:'17年6月11日 14:22 通话23分1秒',
                p_biaoqian:'是否重点跟进；大头；钱多',
                p_key:'0'
            },{
                p_name: '王小虎和他的朋友',
                p_phone: '13966566365',
                p_time:'2018/6/11 14:23',
                p_state:'发展成功',
                p_worker:'黄小林',
                p_closest:'17年6月11日 14:22 通话23分1秒',
                p_biaoqian:'是否重点跟进；大头；钱多',
                p_key:'0'
            }, {
                p_name: '王小虎和他的朋友',
                p_phone: '13966566365',
                p_time:'2018/6/11 14:23',
                p_state:'发展成功',
                p_worker:'黄小林',
                p_closest:'17年6月11日 14:22 通话23分1秒',
                p_biaoqian:'是否重点跟进；大头；钱多',
                p_key:'0'
            }],
            data: [{
                id:1,
                label: '是否重点跟进',
                children: [
                    {label: '重点跟进',id:11,group:0},
                    {label: '不跟进',id:12,group:0}
                ]}, {
                id:2,
                label: '客户年龄段',
                children: [
                    {label: '20-30',id:21,group:1},
                    {label: '30-40',id:22,group:1},
                    {label: '40以上',id:23,group:1}
                ]}, {
                    id:3,
                label: '经济实力',
                children: [
                    {label: '二级 3-1',id:31,group:2},
                    {label: '二级 3-2',id:32,group:2},
            ]}],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            label_list:[],
            tag_list:[]
        }
    },
    components:{history},
    methods:{
        search_change:function(value){
            this.search_state=value;
        },
        custom_change:function(value){
            this.custom_state=value;
        },
        worker_change:function(value){
            this.worker_state=value;
        },
        handleNodeClick(data) {
            this.label_list[data.group]=data.id;
            this.tag_list[data.group]=data.label;
        },
        handlefp:function(){

        },
        handlexx:function(){
            this.show = !this.show;
        }
    }
}
</script>
