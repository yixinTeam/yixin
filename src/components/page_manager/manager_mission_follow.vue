<template>
    <div class="container">
        <div class="nav">外呼任务跟踪</div>
        <div class="part1">
            <div class="part1_show">
                <div class="svg"></div>
                <div class="svg"></div>
                <div class="svg"></div>
                <div class="svg"></div>
            </div>
            <div class="part1_nav">
                <p class="grey">选择展示任务</p>
                <el-checkbox-group v-model="checkedlist" :min="0" :max="4" class="ul" :style="{'text-align':'left','padding':'0 8px','background-color':'#FBFBFB'}" @change="show_mission">
                    <el-checkbox v-for="(item,index) in position" :label="item.taskId" :key="item.taskId" class="li" :checked="index<4">{{item.taskName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="part2">
            <div class="part2_tit">
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="primary" class="button" :style="{float:'left'}" @click="missoin_search">搜索</el-button>
                <el-button type="primary"  class="button" @click="lead_in">导入客户</el-button>
                <Dialog v-bind:leading="leading" @reset="reset" :data="lead_data"></Dialog>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button type="primary" class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">可见状态</p>
                    <p class="black" :class="{see_active:see_state=='1'}" @click="see_change('1')">所有人可见</p>
                    <p class="black" :class="{see_active:see_state=='0'}" @click="see_change('0')">仅管理员可见</p>
                </div>
                <div>
                    <p class="grey">创建时间</p>
                    <el-date-picker v-model="search_date" @change="date_change" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"  prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button type="primary" plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <el-tag type="info" class="tag">{{see_state=='0'?'所有人可见':'仅管理员可见'}}</el-tag>
                
                    <el-tag type="info" class="tag" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
                <el-table-column label="任务名称" class-name="line1" label-class-name="line1_tit" :show-overflow-tooltip=true min-width="120">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./detail', query: { id: scope.row.id }}">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="numberTotal" label="总客户" class-name="line2" sortable='custom'  :show-overflow-tooltip=true min-width="85"> </el-table-column>
                <el-table-column label="已分配" class-name="line3" :show-overflow-tooltip=true >
                    <template slot-scope="scope">
                        {{scope.row.numberTotal-scope.row.unallocatedNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="calledNum" label="已呼" class-name="line4" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="successNum" label="成功" class-name="line5" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="failureNum" label="失败" class-name="line6" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="processingNum" label="跟进" class-name="line7" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="tags" label="关联客户标签" class-name="line8" :show-overflow-tooltip=true min-width="150">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.tags" :key="index">{{item.tagName}};</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create" label="创建时间" class-name="line9" :show-overflow-tooltip=true min-width="120" sortable='custom'> </el-table-column>
                <el-table-column prop="visibleState" label="可见状态" class-name="line10" :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p v-show="scope.row.visibleState==0">仅管理员可见</p>
                            <p v-show="scope.row.visibleState==1">所有人可见</p>
                            <select v-model="scope.row.visibleState" @change="state_select(scope.row,scope.row.visibleState)">
                                <option value="1">所有人可见</option>
                                <option value="0">仅管理员可见</option>
                            </select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlefp(scope.$index, scope.row)" :disabled="scope.row.unallocatedNum==0">分配客户</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handlefr(scope.$index, scope.row)">导入客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
        </div>
        <assign v-bind:assign="assign" :total='p_assign' @reset="reset" :taskId="taskId"></assign>
    </div>
</template>
<style scoped>
    .nav{
        line-height: 30px;
        text-align: left;
        background-color: #fff;
        padding: 0 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
    .part1{
        padding:17px 30px 10px;
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
        box-sizing: border-box;
    }
    .part1_nav .grey{
        text-align:left;
        padding:0 8px;
        margin: 0;
        font-size: 14px;
        color: #666;
    }
    .ul{
        width: 150px;
        height: 164px;
        overflow-y: scroll;
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
        margin: 0 0 10px;
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

</style>

<script>
let echarts = require('echarts/lib/echarts')
  // 引入饼图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和图例组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  import Dialog from "../component/dialog.vue"
  import assign from "../component/dialog_assign.vue"
export default {
    name:'missoin_follow',
    data:function(){
        return {
            missoin_data:[],
            position:[],
            checkedlist:[],
            search:'',
            search_state:false,
            see_state:'1',
            search_date:[],
            leading:false,
            assign:false,
            p_assign:'',
            tableData: [],
            page_count:1,
            taskId:null,
            pageNum:1,
            orderWay:null,
            orderField:null,
            lead_data:null
        }
    },
    components:{
      Dialog,assign
    },
    methods:{
        //画饼图
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
        //初始化饼图数据
        missoin_init:function(item){
            for(let i=0;i<4;i++){
                if(i<item.length){
                    let obj={'id_num':i,'id':item[i].taskName,'key':item[i].taskId,data:[{'name':'发展成功','value':item[i].successNum},{'name':'发展失败','value':item[i].failureNum},{'name':'继续跟进','value':item[i].processingNum},{'name':'未分配','value':item[i].unallocatedNum}]}
                    this.drawPie(obj);
                }else{
                    let obj={'id_num':i};
                    this.drawPie(obj);
                }
                
            }
        },
        see_change:function(value){
            this.see_state=value;
            this.missoin_search();
        },
        date_change(){
            this.missoin_search();
        },
        search_change:function(value){
            this.search_state=value;
        },
        //打开导入客户弹窗
        lead_in:function(){
            this.lead_data=null;
            this.leading = true;
            this.assign=false;
        },
        //打开分配客户弹窗
        handlefp:function(index,row){
            this.assign=true;
            this.leading=false;
            this.p_assign=row.unallocatedNum;
            this.taskId=row.id;
        },
        //导入客户给指定任务
        handlefr:function(index,row){
            console.log(index,row);
            this.lead_data=row;
            this.leading = true;
            this.assign=false;
        },
        //关闭弹窗
        reset:function(){
            this.assign=false;
            this.leading=false;
        },
        show_mission(){
            //选择展示任务
            this.$ajax.post(this.$preix+'/new/calltask/queryIndexCallTaskList',
                this.checkedlist
            ).then((res)=>{
                this.missoin_init(res.data.info);
            })
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={startTime:this.search_date!=null?this.search_date[0]:'',endTime:this.search_date!=null?this.search_date[1]:'',nameLike:this.search,visibleState:this.see_state,pageNum:val,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                if(res.data.code==200){
                    this.tableData=res.data.rows;
                }
            })
        },
        //条件搜索
        missoin_search:function(){
            var data={startTime:this.search_date!=null?this.search_date[0]:'',endTime:this.search_date!=null?this.search_date[1]:'',nameLike:this.search,visibleState:this.see_state,requireTotalCount:true};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                if(res.data.code==200){
                    this.tableData=res.data.rows;
                    this.page_count=res.data.totalCount;
                }
            })
        },
        //排序搜索
        sort_change({column, prop, order} ){
            console.log({column, prop, order});
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={
                startTime:this.search_date!=null?this.search_date[0]:'',endTime:this.search_date!=null?this.search_date[1]:'',nameLike:this.search,visibleState:this.see_state,"orderWay":order.split('ending')[0],'orderField':prop,'pageNum':this.pageNum
            };
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                this.tableData=res.data.rows;
            })
        },
        state_select(row,state){
            console.log(row);
            this.$ajax.post(this.$preix+'/new/calltask/updateCallTask',{'taskId':row.id,'visibleState':state})
            .then( (res) => {
                if(res.data.code==200){
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
                }
            })
            .catch(res=>{
                this.$message({
                    showClose: true,
                    message: '修改失败哦',
                    type: 'warning'
                });
            })
        }
    },
    mounted:function(){
        //左侧饼图数据
        this.$ajax.post(this.$preix+'/new/calltask/queryIndexCallTaskList')
        .then( (res) => {
            if(res.data.code==200){
                this.missoin_init(res.data.info);
            }
        });
        //右侧任务多选列表
        this.$ajax.post(this.$preix+'/new/calltask/queryRightCallTaskList')
        .then( (res) => {
            if(res.data.code==200){
                this.position=res.data.rows;
            }
        });
        //下方任务列表
        this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',{requireTotalCount:true,"orderField":'creat',"orderWay":'desc'})
        .then( (res) => {
            if(res.data.code==200){
                this.page_count=res.data.totalCount;
                this.tableData=res.data.rows;
            }
        })
    }
}
</script>

