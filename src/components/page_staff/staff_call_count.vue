<template>
    <div class="container">
        <div class="part1">
            <div class="p1_tit">
                <p>统计时间</p>
                <el-radio-group v-model="time_past" class="p3_radio" @change="change">
                    <el-radio :label="1">过去24小时</el-radio>
                    <el-radio :label="7">过去7天</el-radio>
                    <el-radio :label="30">过去30天</el-radio>
                    <el-radio :label="2">其他时间</el-radio>
                    <el-date-picker
                    v-show="time_past==2"
                    v-model="leading_date"
                    type="daterange"
                    :picker-options="pickerOptions"
                    range-separator="-" @change="time_change"
                    start-placeholder="开始日期" :style="{'margin':'0 12px'}"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-radio-group>
            </div>
        </div>
        <div class="part2">
            <ul>
                <li>
                    <p class="black">{{infos.calledTotal}}</p>
                    <p class="grey">总呼叫次数</p>
                </li>
                <li>
                    <p class="black">{{infos.callTalkedTotal}}</p>
                    <p class="grey">总呼通次数</p>
                </li>
                <li>
                    <p class="black">{{infos.calledNumTotal}}</p>
                    <p class="grey">总呼叫人数</p>
                </li>
                <li>
                    <p class="black">{{infos.callTalkedNumToal}}</p>
                    <p class="grey">总呼通人数</p>
                </li>
                <li>
                    <p class="black">{{infos.calledDuration}}</p>
                    <p class="grey">总呼叫时长(min)</p>
                </li>
                <li>
                    <p class="black">{{infos.calledDuration?info.calledDuration/infos.callTalkedTotal:0}}</p>
                    <p class="grey">平均呼叫时长(s)</p>
                </li>
            </ul>
        </div>
        <div class="zhankai" v-if="search_state==false">
            <el-button type="info" plain class="button" @click="search()">搜索收起</el-button>
            <div>
                <p class="grey">任务名称&#12288;&#12288;</p>
                <p v-for="(item,index) in mission_list" :key="index" class="black" :class="{worker_active:mission_active.indexOf(index)!=-1}" @click="mission_change(index)">{{item.taskName}}</p>
            </div>
            <div>
                <p class="grey">客户状态&#12288;&#12288;</p>
                <p v-for="(item,index) in custom_list" :key="index" class="black" :class="{worker_active:custom_active.indexOf(index)!=-1}" @click="custom_change(index)">{{item.value}}</p>
            </div>
            <div>
                <p class="grey">最近通话情况</p>
                <p v-for="(item,index) in call_list" :key="index" class="black" :class="{worker_active:call_active.indexOf(index)!=-1}" @click="call_change(index)">{{item.value}}</p>
            </div>
        </div>
        <div class="zhankai" v-if="search_state">
            <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
            <div>
                <p class="grey">筛选条件</p>
                 <p class="black worker_active">任务名称：<span v-for="(item,index) in mission_active" :key="index">{{mission_list[item].taskName}};</span></p>
                <p class="black worker_active">客户状态：{{custom_list[custom_active].value}}</p>
                <p class="black worker_active">最近通话情况：  {{call_list[call_active].value}}</p>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
            <el-table-column prop="userName" label="客户姓名" class-name="line1" label-class-name="line1_tit" sortable='custom' :show-overflow-tooltip=true min-width="80">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column prop="userNumber" label="客户号码" class-name="line2"  :show-overflow-tooltip=true> </el-table-column>
            <el-table-column prop="taskName" label="所属任务" class-name="line4" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
            <el-table-column label="客户状态" class-name="line5" :show-overflow-tooltip=true>
                <!-- 0：预留 1：继续跟进 2：发展成功 3：发展失败 -->
                <template slot-scope="scope">
                    <span v-if="scope.row.userResult==0">预留</span>
                    <span v-if="scope.row.userResult==1">继续跟进</span>
                    <span v-if="scope.row.userResult==2">发展成功</span>
                    <span v-if="scope.row.userResult==3">发展失败</span>
                </template> 
            </el-table-column>
            <el-table-column label="最近通话情况" class-name="line6" :show-overflow-tooltip=true>
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
            <el-table-column prop="hangupTime" label="最近通话时间" class-name="line7" sortable='custom' :show-overflow-tooltip=true min-width="100"> </el-table-column>
            <el-table-column prop="callDurationDesc" label="通话时长" class-name="line8" sortable='custom' :show-overflow-tooltip=true>
            </el-table-column>
            <el-table-column prop="nextContactTime" label="下次联系时间" class-name="line9" sortable='custom' :show-overflow-tooltip=true min-width="120"> </el-table-column>
            <el-table-column prop="recordFilePath" label="通话录音" class-name="line10" :show-overflow-tooltip=true min-width="100">
                <template slot-scope="scope">
                    {{scope.row.key9}}
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
            time_past:1,
            search_state:false,
            mission_list:[],
            mission_active:[0],
            //0：预留 1：继续跟进 2：发展成功 3：发展失败
            custom_list:[{'key':'','value':'全部'},{'key':'1','value':'持续跟进'},{'key':'2','value':'发展成功'},{'key':'3','value':'发展失败'}],
            custom_active:[0],
            call_list:[{'key':'','value':'全部'},{'key':'10','value':'正常通话'},{'key':'22','value':'未接通'}],
            call_active:[0],
            tableData:[],
            infos:{
                "callTalkedNumToal" : 0,
                "callTalkedTotal" : 0,
                "calledDuration" : 0,
                "calledNumTotal" : 0,
                "calledTotal" : 0,
                "failureNum" : 0,
                "progressingNum" : 0,
                "successNum" : 0
            },
            leading_date:[],
            page_count:0,
            pickerOptions:{
                disabledDate:(time)=>{
                    return time.getTime()>new Date().getTime()||time.getTime()<new Date(new Date().getTime() - 30*24*60*60*1000).getTime()
                }
            },
            pageNum:1,
            orderWay:null,
            orderField:null
        }
    },
    mounted() {
        var data = {
			name: 'wshqy1001',
			password: '123456',
			password2: '123456',
		};
		this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate', data).then(res=>{
            this.leading_record=[this.date_init(new Date(new Date().getTime() - 24*60*60*1000)),this.date_init(new Date())];
            this.init(this.date_init(new Date(new Date().getTime() - 24*60*60*1000)),this.date_init(new Date()));
            this.task_init();
        });
    },
    methods:{
        time_change:function(){
            if(this.leading_date!=null){
                this.init(this.leading_date[0],this.leading_date[1]);
            }
        },
        mission_change:function(value){
            let _this=this;
            if(this.mission_active.indexOf(value)==-1&&value!=0){
                this.mission_active.push(value);
                for(let i in this.mission_active){
                    if(this.mission_active[i]==0){
                        //delete this.mission_active[i];
                        _this.mission_active.splice(i,1);
                    }
                }
            }else if(this.mission_active.indexOf(value)!=-1&&this.mission_active.length>1){
                var index=this.mission_active.indexOf(value);
                this.mission_active.splice(index,1);
            }else if(value==0){
                this.mission_active=[0];
            }
        },
        custom_change:function(value){
            let _this=this;
            if(this.custom_active.indexOf(value)==-1&&value!=0){
                this.custom_active.push(value);
                for(let i in this.custom_active){
                    if(this.custom_active[i]==0){
                        //delete this.custom_active[i];
                        _this.custom_active.splice(i,1);
                    }
                }
            }else if(this.custom_active.indexOf(value)!=-1&&this.custom_active.length>1){
                var index=this.custom_active.indexOf(value);
                this.custom_active.splice(index,1);
            }else if(value==0){
                this.custom_active=[0];
            }
        },
        call_change:function(value){
            let _this=this;
            if(this.call_active.indexOf(value)==-1&&value!=0){
                this.call_active.push(value);
                for(let i in this.call_active){
                    if(this.call_active[i]==0){
                        //delete this.call_active[i];
                        _this.call_active.splice(i,1);
                    }
                }
            }else if(this.call_active.indexOf(value)!=-1&&this.call_active.length>1){
                var index=this.call_active.indexOf(value);
                this.call_active.splice(index,1);
            }else if(value==0){
                this.call_active=[0];
            }
        },
        search_change:function(value){
            this.search_state=value;
        },
        date_init(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'-'+month+'-'+day;
        },
        task_init(){
            //任务列表
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/calltask/queryTaskIntroOnWallBySeat',{"pageNum" : 1,'pageSize':100})
            .then( (res) => {
                if(res.data.code==200){
                    console.log(res.data.rows)
                    res.data.rows.splice(0,0,{'taskName':'全部','taskId':''});
                    res.data.rows.map((value, index)=>value.key=index);
                    this.mission_list=res.data.rows;
                }
            });
        },
        init(beginTime,endTime,data){
            //上方完成情况
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/callstatistics/querySeatTaskCompletion',{beginDay:beginTime,endDay:endTime,"requireTotalCount" : true}
            ).then( res=>{
                if(res.data.code==200&&res.data.info){
                    this.infos=res.data.info;
                }
            });
            //下方表格数据
            //var data={"requireTotalCount" : true,beginDay:beginTime,endDay:endTime};
            this.mission_init(data?data:{beginDay:beginTime,endDay:endTime,"requireTotalCount" : true});
        },
        //条件搜索
        search(){
            this.search_state=true;
            if(this.time_past==2&&this.leading_date!=null){
                var beginTime=this.leading_date[0];
                var endTime=this.leading_date[1];
            }else{
                var beginTime=this.date_init(new Date(new Date().getTime() - this.time_past*24*60*60*1000));
                var endTime=this.date_init(new Date());
            }
            let taskIds=this.mission_active.map(item=>this.mission_list[item].taskId);
            var data={
                'beginDay':beginTime,'endDay':endTime,"requireTotalCount" : true,'taskIds':taskIds,userResults:this.custom_list[this.custom_active].key,callResults:this.call_list[this.call_active].key
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            console.log(data);
            this.init(beginTime,endTime,data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            if(this.time_past==2&&this.leading_date!=null){
                var beginTime=this.leading_date[0];
                var endTime=this.leading_date[1];
            }else{
                var beginTime=this.date_init(new Date(new Date().getTime() - this.time_past*24*60*60*1000));
                var endTime=this.date_init(new Date());
            }
            let taskIds=this.mission_active.map(item=>this.mission_list[item].taskId);
            var data={
                'beginDay':beginTime,'endDay':endTime,"requireTotalCount" : true,'taskIds':taskIds,userResults:this.custom_list[this.custom_active].key,callResults:this.call_list[this.call_active].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(beginTime,endTime,data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            if(this.time_past==2&&this.leading_date!=null){
                var beginTime=this.leading_date[0];
                var endTime=this.leading_date[1];
            }else{
                var beginTime=this.date_init(new Date(new Date().getTime() - this.time_past*24*60*60*1000));
                var endTime=this.date_init(new Date());
            }
            let taskIds=this.mission_active.map(item=>this.mission_list[item].taskId);
            var data={
                'beginDay':beginTime,'endDay':endTime,"requireTotalCount" : true,'taskIds':taskIds,userResults:this.custom_list[this.custom_active].key,callResults:this.call_list[this.call_active].key,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(beginTime,endTime,data);
        },
        //时间查询
        change:function(){
            if(this.time_past==2){
                var beginTime=this.date_init(new Date(new Date().getTime() - 2*24*60*60*1000));
                var endTime=this.date_init(new Date(new Date().getTime() - 1*24*60*60*1000));
            }else{
                var beginTime=this.date_init(new Date(new Date().getTime() - this.time_past*24*60*60*1000));
                var endTime=this.date_init(new Date());
                this.init(beginTime,endTime);
            }
        },
        //表格信息查询
        mission_init(data){
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/callstatistics/findCallStatisticsDetailList',data)
            .then( (res) => {
                if(res.data.code==200){
                    console.log(res);
                    this.page_count=res.data.totalCount;
                    this.tableData=res.data.rows;
                }
            })
        },
    }
}
</script>

