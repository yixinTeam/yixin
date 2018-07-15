<template>
    <div class="container">
        <div class="part1">
            <div class="p1_tit">
                <p>统计时间</p>
                <el-radio-group v-model="time_past" class="p3_radio" @change="change">
                    <el-radio :label="1">过去24小时</el-radio>
                    <el-radio :label="2">过去7天</el-radio>
                    <el-radio :label="3">过去30天</el-radio>
                    <el-radio :label="4">其他时间</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="part2">
            <ul>
                <li>
                    <p class="black">88</p>
                    <p class="grey">总呼叫次数</p>
                </li>
                <li>
                    <p class="black">44</p>
                    <p class="grey">总呼通次数</p>
                </li>
                <li>
                    <p class="black">66</p>
                    <p class="grey">总呼叫人数</p>
                </li>
                <li>
                    <p class="black">60</p>
                    <p class="grey">总呼通人数</p>
                </li>
                <li>
                    <p class="black">220</p>
                    <p class="grey">总呼叫时长(min)</p>
                </li>
                <li>
                    <p class="black">45</p>
                    <p class="grey">平均呼叫时长(s)</p>
                </li>
            </ul>
        </div>
        <div class="zhankai" v-if="search_state==false">
            <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
            <div>
                <p class="grey">任务名称&#12288;&#12288;</p>
                <p v-for="(item,index) in missionList" :key="item.key" class="black" :class="{worker_active:mission_active==index}" @click="mission_change(index)">{{item.value}}</p>
            </div>
            <div>
                <p class="grey">客户状态&#12288;&#12288;</p>
                <p v-for="(item,index) in customList" :key="item.key" class="black" :class="{worker_active:custom_active==index}" @click="custom_change(index)">{{item.value}}</p>
            </div>
            <div>
                <p class="grey">最近通话情况</p>
                <p v-for="(item,index) in callList" :key="item.key" class="black" :class="{worker_active:call_active==index}" @click="call_change(index)">{{item.value}}</p>
            </div>
        </div>
        <div class="zhankai" v-if="search_state">
            <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
            <div>
                <p class="grey">筛选条件</p>
                <p class="black worker_active">任务名称：{{missionList[mission_active].value}}</p>
                <p class="black worker_active">客户状态：{{customList[custom_active].value}}</p>
                <p class="black worker_active">最近通话情况：  {{callList[call_active].value}}</p>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
            <el-table-column label="客户姓名" class-name="line1" label-class-name="line1_tit" sortable :show-overflow-tooltip=true min-width="80">
                <template slot-scope="scope">
                    {{scope.row.key1}}
                </template>
            </el-table-column>
            <el-table-column prop="key2" label="客户号码" class-name="line2"  :show-overflow-tooltip=true> </el-table-column>
            <el-table-column prop="key3" label="所属任务" class-name="line4" sortable :show-overflow-tooltip=true> </el-table-column>
            <el-table-column prop="key4" label="客户状态" class-name="line5" :show-overflow-tooltip=true> </el-table-column>
            <el-table-column prop="key5" label="最近通话情况" class-name="line6" :show-overflow-tooltip=true> </el-table-column>
            <el-table-column prop="key6" label="最近通话时间" class-name="line7" sortable :show-overflow-tooltip=true min-width="100"> </el-table-column>
            <el-table-column prop="key7" label="通话时长" class-name="line8" sortable :show-overflow-tooltip=true>
            </el-table-column>
            <el-table-column prop="key8" label="下次联系时间" class-name="line9" sortable :show-overflow-tooltip=true min-width="120"> </el-table-column>
            <el-table-column prop="key9" label="通话录音" class-name="line10" :show-overflow-tooltip=true min-width="100">
                <template slot-scope="scope">
                    {{scope.row.key9}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
    .part1,.part2{
        text-align: left;
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }
    .part1{
        font-size: 14px;
        padding: 10px 0;
    }
    .p1_tit{
        overflow: hidden;
    }
    .p1_radio{
        float: left;
        margin: 20.67px 20px;
        font-size: 14px;
    }
    .p1_tit>p{
        float: left;
        margin: 0 30px 0 0;
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
        font-size: 12px;
    }
    .zhankai .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin-top: 10px;
    }
    .worker_active{
        background-color: rgba(153, 153, 153, 1);
        color: #fff;
    }
</style>

<script>
export default {
    name:'Staff_call_count',
    data:function(){
        return {
            time_past:'',
            search_state:false,
            missionList:[{
                key:1,value:'全部'
            },{
                key:2,value:'武林壹号啊'
            },{
                key:3,value:'武林二号'
            },{
                key:4,value:'武林三号大客户业主'
            },{
                key:5,value:'武林四号'
            }],
            mission_active:'0',
            customList:[{
                key:1,value:'全部'
            },{
                key:2,value:'未分配'
            },{
                key:3,value:'持续跟进'
            },{
                key:4,value:'发展成功'
            },{
                key:5,value:'发展失败'
            }],
            custom_active:'0',
            callList:[{
                key:1,value:'全部'
            },{
                key:2,value:'未接通'
            },{
                key:3,value:'通话成功'
            }],
            call_active:'0',
            tableData:[{
                key1:'张阿猫',
                key2:'13966566365',
                key3:'武林壹号',
                key4:'持续跟进',
                key5:'通话成功',
                key6:'2018/6/11 14:23:11',
                key7:'1分23秒',
                key8:'2018/6/11 14:23',
                key9:'00:00/23:23'
            }]
        }
    },
    mounted() {
    },
    methods:{
        change:function(){
            
        },
        mission_change:function(value){
            this.mission_active=value;
        },
        custom_change:function(value){
            this.custom_active=value;
        },
        call_change:function(value){
            this.call_active=value;
        },
        search_change:function(value){
            this.search_state=value;
        }
    }
}
</script>

