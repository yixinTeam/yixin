<template>
    <div class="container">
        <div class="part2">
            <div class="part2_tit">
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="info" class="button" :style="{float:'left'}">搜索</el-button>
                <div class="time">
                    <p class="grey">查询时间</p>
                    <el-date-picker
                    v-model="leading_date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期" :style="{'float':'left'}"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <el-button type="info" plain class="button" :style="{'float':'right'}">导出当前结果</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="p_name" label="坐席昵称" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_phone" label="坐席账号" class-name="line3" :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_time" label="总呼叫次数" class-name="line4" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_state" label="总呼通次数" class-name="line5" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_worker" label="总呼叫人数" class-name="line6" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_closest" label="总呼通人数" class-name="line7" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_biaoqian" label="总呼叫时长" class-name="line8" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_biaoqian2" label="平均呼叫时长" class-name="line8" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="60">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./call_detail'}">
                        <el-button
                        size="mini" type="text"
                        @click="handlexx(scope.$index, scope.row)">呼叫详单</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :total="1000">
            </el-pagination>
        </div>
        
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
    .time{
        float: left;
        overflow: hidden;
        margin: 0px 16px;
    }
    .time>p{
        float: left;
        padding: 4px 2px;
    }
    .time>p.grey{
        margin: 0 14px;
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

<script>
export default {
    name:'call_count',
    data:function(){
        return {
            search:'',
            leading_date:[],
            tableData: [{
                p_name: '张阿猫',
                p_phone: 'fwjqy1001',
                p_time:'22',
                p_state:'1',
                p_worker:'22',
                p_closest:'1',
                p_biaoqian:'1小时30分',
                p_biaoqian2:'1分10秒',
                p_key:'0'
            },{
                p_name: '张阿猫',
                p_phone: 'fwjqy1001',
                p_time:'22',
                p_state:'1',
                p_worker:'22',
                p_closest:'1',
                p_biaoqian:'1小时30分',
                p_biaoqian2:'1分10秒',
                p_key:'0'
            },{
                p_name: '张阿猫',
                p_phone: 'fwjqy1001',
                p_time:'22',
                p_state:'1',
                p_worker:'22',
                p_closest:'1',
                p_biaoqian:'1小时30分',
                p_biaoqian2:'1分10秒',
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
