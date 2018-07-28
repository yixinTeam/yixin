<template>
    <div class="container">
        <div class="part1">
            <router-link :to="{path:'./follow'}">
                外呼任务跟踪
            </router-link>
            <i class="el-icon-arrow-right"></i>
            任务详情
        </div>
        <div class="part2">
            <div class="part2_tit">
                <el-input placeholder="按任务名称搜索" prefix-icon="el-icon-search" v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="info" class="button" :style="{float:'left'}" @click="missoin_search">搜索</el-button>
                <el-button type="info" plain class="button">导出当前结果</el-button>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">客户状态</p>
                    <p class="black" v-for=" (item,index) in custom_list" :key="index" :class="{see_active:custom_state==index}" @click="custom_change(index)">{{item.value}}</p>
                </div>
                <!-- <div>
                    <p class="grey">跟进坐席</p>
                    <p class="black" v-for=" (item,index) in worker_list" :key="index" :class="{see_active:worker_state==index}" @click="worker_change(index,item.id)">{{item.shortName}}</p>
                </div> -->
                <div>
                    <p class="grey">导入时间</p>
                    <el-date-picker v-model="leading_date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
                <div>
                    <p class="grey">客户标签</p>
                    <el-dropdown :hide-on-click="false" v-for="(item,index) in data" :key="index"  @command="handleCommand">
                        <span class="el-dropdown-link">
                            {{item.tagName}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(_item,_index) in item.tags" :key="_index" :command="{'index':index,'value':_item}">{{_item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <p class="black see_active">客户状态：{{custom_state==''?custom_list[0].value:custom_list[custom_state].value}}</p>
                    <!-- <p class="black see_active">跟进坐席：{{worker_list[worker_state].shortName}}</p>
                    <el-tag type="info" class="tag" v-if="leading_date!=null&&leading_date.length>0">{{'导入时间： '+leading_date[0]+'~'+leading_date[1]}}</el-tag> -->
                    <p class="black see_active" v-if="tags.length>0">客户标签：<span  v-for="(item,index) in tags" :key="index" v-if="item!=undefined" >{{item.value}}&#12288;</span></p>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
                <el-table-column prop="userName" label="客户姓名" class-name="line2" sortable='custom'  :show-overflow-tooltip=true min-width="80"> </el-table-column>
                <el-table-column prop="userNumber" label="手机号" class-name="line3" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="create" label="导入时间" class-name="line4" sortable='custom' :show-overflow-tooltip=true min-width="130"> </el-table-column>
                <!-- 0：预留 1：继续跟进 2：发展成功 3：发展失败 -->
                <el-table-column label="客户状态" class-name="line5" :show-overflow-tooltip=true min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.userResult==0">预留</span>
                        <span v-if="scope.row.userResult==1">继续跟进</span>
                        <span v-if="scope.row.userResult==2">发展成功</span>
                        <span v-if="scope.row.userResult==3">发展失败</span>
                    </template>
                </el-table-column>
                <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                <el-table-column label="最近通话" class-name="line7" :show-overflow-tooltip=true min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.callResult==0">未开始</span>
                        <span v-if="scope.row.callResult==10">正常通话</span>
                        <span v-if="scope.row.callResult==11">转给其他坐席</span>
                        <span v-if="scope.row.callResult==12">转值班电话</span>
                        <span v-if="scope.row.callResult==21">没坐席接听</span>
                        <span v-if="scope.row.callResult==22">未接通</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户标签" class-name="line8" :show-overflow-tooltip=true min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.tagList.join(';')}}
                    </template>
                </el-table-column>
                 <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="130">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlexx(scope.$index, scope.row)">详细记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
        </div>
        <transition name="slide">
            <history id="history" v-if="show" :head='true' :details='history_detail' @close="history_close"></history>
        </transition>
        
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
        box-shadow:-2px 1px 5px #ccc;
    }
</style>
<style scoped>
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
.el-dropdown-link {
cursor: pointer;
font-size: 12px;
margin:0 8px;
}
.el-icon-arrow-down {
font-size: 12px;
}
</style>

<script>
import history from '../component/history_talk.vue'
export default {
    name:'staff_detail',
    data:function(){
        return {
            show:false,
            search:'',
            search_state:false,
            custom_state:'',
            worker_state:0,
            leading_date:[],
            page_count:10,
            //0：预留 1：继续跟进 2：发展成功 3：发展失败
            custom_list:[{'key':'','value':'全部'},{'key':'1','value':'持续跟进'},{'key':'2','value':'发展成功'},{'key':'3','value':'发展失败'}],
            worker_list:[],
            tableData: [],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            history_detail:[],
            label_list:[],
            tags:[],
            pageNum:1,
            orderWay:null,
            orderField:null
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
        handlefp:function(){

        },
        //打开历史记录
        handlexx:function(index,row){
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/seatWorkbench/queryResultHistoryEntity',{'taskId':row.taskId,'taskClientId':row.taskClientId}
            ).then( res=>{
                if(res.status==200){
                    this.show = true;
                    this.history_detail=res.data.info.details;
                }
            });
        },
        //关闭历史记录
        history_close(){
            this.show=false;
        },
        //查询任务信息
        mission_init(data){
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/seatCallTask/findSeatCallTaskDetail',data)
            .then( (res) => {
                if(res.data.code==200){
                    for(let i=0;i<res.data.rows.length;i++){
                        res.data.rows[i].tagList=[];
                        for(var key in res.data.rows[i]){
                            if(key.indexOf('customTag')!=-1){
                                res.data.rows[i].tagList.push(res.data.rows[i][key]);
                            }
                        }
                    }
                    this.tableData=res.data.rows;
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                }
            });
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={'taskId':this.$route.query.id,userResults:this.custom_state,createBeginTime:this.leading_date!=null?this.leading_date[0]:'',createEndTime:this.leading_date!=null?this.leading_date[1]:'',nameOrNumber:this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            for(let i=0;i<this.tags.length;i++){
                if(this.tags[i]!=null||this.tags[i]!=undefined){
                    var str='customTag'+(i+1);
                    data[str]=[this.tags[i].value];
                }
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
            var data={'taskId':this.$route.query.id,userResults:this.custom_state,createBeginTime:this.leading_date!=null?this.leading_date[0]:'',createEndTime:this.leading_date!=null?this.leading_date[1]:'',nameOrNumber:this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            for(let i=0;i<this.tags.length;i++){
                if(this.tags[i]!=null||this.tags[i]!=undefined){
                    var str='customTag'+(i+1);
                    data[str]=[this.tags[i].value];
                }
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
        },
        //条件搜索
        missoin_search:function(){
            var data={'taskId':this.$route.query.id,"requireTotalCount" : true,userResults:this.custom_state,createBeginTime:this.leading_date!=null?this.leading_date[0]:'',createEndTime:this.leading_date!=null?this.leading_date[1]:'',nameOrNumber:this.search};
            for(let i=0;i<this.tags.length;i++){
                if(this.tags[i]!=null||this.tags[i]!=undefined){
                    var str='customTag'+(i+1);
                    data[str]=this.tags[i].value;
                }
            }
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
            this.search_state=true;
        },
        handleCommand(command) {
            this.tags[command.index]={'value':command.value};
        }
    },
    //页面初始化数据
    mounted(){
        var datas = {
			name: 'qy1003',
			password: 'qy1003',
			password2: '123456',
		};
        this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate', datas).then(res=>{
            var data={'taskId':this.$route.query.id,"requireTotalCount" : true,"pageNum" : 1,"pageSize" : 10};
            this.mission_init(data);
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/tag/findTagList')
            .then( (res) => {
                if(res.data.code==200){
                    for(let i=0;i<res.data.info.length;i++){
                        res.data.info[i].tags=res.data.info[i].tagValue.split(';');
                    }
                    this.data=res.data.info;
                }
            });
        })
        
    }
}
</script>
