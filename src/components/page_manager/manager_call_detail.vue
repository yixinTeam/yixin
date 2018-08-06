<template>
    <div class="container">
        <div class="part1">
            <router-link :to="{path:'./call_count'}">
                坐席呼叫统计
            </router-link>
            <i class="el-icon-arrow-right"></i>
            呼叫详单
        </div>
        <div class="part2">
            <div class="zhankai" v-if="search_state==false">
                <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">任务名称&#12288;&#12288;</p>
                    <p class="black" v-for=" (item,index) in mission_list" :key="index" :class="{see_active:mission_state.indexOf(index)!=-1}" @click="mission_change(index)">{{item.taskName}}</p>
                </div>
                <div>
                    <p class="grey">客户状态&#12288;&#12288;</p>
                    <p class="black" v-for=" (item,index) in custom_list" :key="index" :class="{see_active:custom_state==index}" @click="custom_change(index)">{{item.value}}</p>
                </div>
                <div>
                    <p class="grey">最近通话情况</p>
                    <p class="black" v-for=" (item,index) in call_list" :key="index" :class="{see_active:call_state==index}" @click="call_change(index)">{{item.value}}</p>
                </div>
                <div>
                    <p class="grey">最近通话&#12288;&#12288;</p>
                    <el-date-picker
                    v-model="close_date"
                    @change="date_change"
                    type="daterange"
                    range-separator="-"
                    :picker-options="pickerOptions"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="black">筛选条件&#12288;&#12288;</p>
                    <p class="black see_active">任务名称：<span v-for="(item,index) in mission_state" :key="index">{{mission_list[item].taskName}};</span></p>
                    <p class="black see_active">客户状态：{{custom_list[custom_state].value}}</p>
                    <p class="black see_active">最近通话情况：{{call_list[call_state].value}}</p>
                    <el-tag type="info" class="tag" v-if="close_date!=null&&close_date.length>0">{{'最近通话： '+close_date[0]+'~'+close_date[1]}}</el-tag>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
                <el-table-column prop="userName" label="客户姓名" class-name="line2" sortable='custom'  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="userNumber" label="手机号" class-name="line3" :show-overflow-tooltip=true min-width="110"> </el-table-column>
                <el-table-column prop="taskName" label="所属任务" class-name="line4" sortable='custom' :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column label="客户状态" class-name="line5" :show-overflow-tooltip=true min-width="80">
                    <!-- 0：预留 1：继续跟进 2：发展成功 3：发展失败 -->
                    <template slot-scope="scope">
                        <span v-if="scope.row.userResult==0">预留</span>
                        <span v-if="scope.row.userResult==1">继续跟进</span>
                        <span v-if="scope.row.userResult==2">发展成功</span>
                        <span v-if="scope.row.userResult==3">发展失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="最近通话情况" class-name="line6" :show-overflow-tooltip=true min-width="100">
                    <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                    <template slot-scope="scope">
                        <span v-if="scope.row.callResult==0">未开始</span>
                        <span v-if="scope.row.callResult==10">正常通话</span>
                        <span v-if="scope.row.callResult==11">转给其他坐席</span>
                        <span v-if="scope.row.callResult==12">转值班电话</span>
                        <span v-if="scope.row.callResult==21">没坐席接听</span>
                        <span v-if="scope.row.callResult==22">未接通</span>
                    </template>
                </el-table-column>
                <el-table-column prop="hangupTime" label="最近通话时间" class-name="line7" :show-overflow-tooltip=true min-width="130"> </el-table-column>
                <el-table-column prop="callDurationDesc" label="通话时长" class-name="line8" :show-overflow-tooltip=true min-width="80"> </el-table-column>
                <el-table-column prop="nextContactTime" label="下次联系时间" class-name="line8" :show-overflow-tooltip=true min-width="130">
                    <template slot-scope="scope">
                        <span>{{scope.row.nextContactTime?scope.row.nextContactTime:'无'}}</span>
                    </template>
                </el-table-column>
                 <el-table-column prop="recordFilePath" class-name="line11" label="通话录音"  min-width="160">
                    <template slot-scope="scope">
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
              layout="prev, pager, next"
              :page-size="10"
              @current-change='page_change'
              :total="page_count">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
    }
    .part1{
        text-align: left;
        padding: 8px;
        font-size: 14px;
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
    .part1_nav{
        width: 20%;
        float: left;
        border-left: 1px solid #eee;
        box-sizing: border-box;
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
</style>

<script>
export default {
    name:'call_detail',
    data:function(){
        return {
            show:false,
            search:'',
            search_state:false,
            custom_state:0,
            worker_state:0,
            close_date:null,
            //0：预留 1：继续跟进 2：发展成功 3：发展失败
            custom_list:[{'key':'','value':'全部'},{'key':'0','value':'未分配'},{'key':'1','value':'持续跟进'},{'key':'2','value':'发展成功'},{'key':'3','value':'发展失败'}],
           //呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 
            call_list:[{'key':'','value':'全部'},{'key':'10','value':'正常通话'},{'key':'22','value':'未接通'}],
            call_state:0,
            tableData: [],
            label_list:[],
            tag_list:[],
            mission_list:[],
            mission_state:[0],
            pickerOptions:{
                disabledDate:(time)=>{
                    return time.getTime()<new Date(this.$route.query.days[0]).getTime()||time.getTime()>new Date(this.$route.query.days[1]).getTime()
                }
            },
            page_count:0,
            pageNum:1,
            orderWay:null,
            orderField:null
        }
    },
    methods:{
        date_change(){
            this.mission_search();
        },
        search_change:function(value){
            this.search_state=value;
            this.mission_search();
        },
        custom_change:function(value){
            this.custom_state=value;
            this.mission_search();
        },
        call_change:function(value){
            this.call_state=value;
            this.mission_search();
        },
        mission_change:function(value){
            if(this.mission_state.indexOf(value)==-1&&value!=0){
                this.mission_state.push(value);
                for(let i in this.mission_state){
                    if(this.mission_state[i]==0){
                        //delete this.mission_state[i];
                        this.mission_state.splice(i,1);
                    }
                }
            }else if(this.mission_state.indexOf(value)!=-1&&this.mission_state.length>1){
                var index=this.mission_state.indexOf(value);
                this.mission_state.splice(index,1);
            }else if(value==0){
                this.mission_state=[0];
            }
            this.mission_search();
        },
        task_init(){
            //任务列表
            this.$ajax.post(this.$preix+'/new/calltask/queryRightCallTaskList',{'pageSize':100})
            .then( (res) => {
                if(res.data.code==200){
                    res.data.rows.splice(0,0,{'taskName':'全部','taskId':''});
                    res.data.rows.map((value, index)=>value.key=index);
                    this.mission_list=res.data.rows;
                }
            });
        },
        mission_init(data){
            this.$ajax.post(this.$preix+'/new/callstatistics/findCallStatisticsDetailList',data)
            .then( (res) => {
                if(res.data.code==200){
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                    this.tableData=res.data.rows;
                }
            })
        },
        //条件搜索
        mission_search(){
            let taskIds=this.mission_state.map(item=>this.mission_list[item].taskId);
            if(this.close_date!=undefined||this.close_date!=null){
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.close_date[0],endDay:this.close_date[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key};
            
            }else{
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.$route.query.days[0],endDay:this.$route.query.days[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key};
            
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            let taskIds=this.mission_state.map(item=>this.mission_list[item].taskId);
            if(this.close_date!=undefined||this.close_date!=null){
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.close_date[0],endDay:this.close_date[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            
            }else{
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.$route.query.days[0],endDay:this.$route.query.days[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            let taskIds=this.mission_state.map(item=>this.mission_list[item].taskId);
            if(this.close_date!=undefined||this.close_date!=null){
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.close_date[0],endDay:this.close_date[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            
            }else{
                var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.$route.query.days[0],endDay:this.$route.query.days[1],'taskIds':taskIds,userResults:this.custom_list[this.custom_state].key,callResults:this.call_list[this.call_state].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
        }
    },
    mounted(){
        var data={'seatAccountId':this.$route.query.id,"requireTotalCount" : true,beginDay:this.$route.query.days[0],endDay:this.$route.query.days[1]};
        this.task_init();
        this.mission_init(data);
    }
}
</script>
