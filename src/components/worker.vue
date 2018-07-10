<template>
    <div class="container">
        <div class="part1">
            <div class="part1_tit">
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="info" class="button" :style="{float:'left'}" @click="findSeat">搜索</el-button>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">客户状态</p>
                    <p class="black" :class="{worker_active:worker_state==''}" @click="worker_change('')">全部</p>
                    <p class="black" :class="{worker_active:worker_state=='3'}" @click="worker_change('3')">停用</p>
                    <p class="black" :class="{worker_active:worker_state=='2'}" @click="worker_change('2')">冻结</p>
                    <p class="black" :class="{worker_active:worker_state=='1'}" @click="worker_change('1')">激活</p>
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
                    <p class="black worker_active" v-show="worker_state==''">全部</p>
                    <el-tag type="info" class="tag" v-if="search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <div id="operate">
                <p>选中{{multipleSelection.length}}个坐席</p>
                <el-button type="info" size="mini" class="button" @click="selectreset">重置密码</el-button>
                <el-button type="info" size="mini" class="button" @click="selectcopy">复制信息</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @selection-change="handleSelectionChange" header-row-class-name="table_head">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="坐席账号" class-name="line1" label-class-name="line1_tit" sortable :show-overflow-tooltip=true min-width="120">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./detail', query: { id: '111' }}">
                            {{scope.row.loginName}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="shortName" label="坐席昵称" class-name="line2" sortable :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p>{{scope.row.shortName}}</p>
                            <input type="text" @blur="upSeat(scope.$index, scope.row,'shortName')" v-model="scope.row.shortName">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="坐席状态" class-name="line3" sortable :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p v-show="scope.row.state==1">激活中</p>
                            <p v-show="scope.row.state==2">已冻结</p>
                            <p v-show="scope.row.state==3">已停用</p>
                            <select v-model="scope.row.state">
                                <option value="3">已停用</option>
                                <option value="2">已冻结</option>
                                <option value="1">激活中</option>
                            </select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="create" label="创建时间" class-name="line4" sortable :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                <el-table-column prop="recentCallTime" label="最近通话" class-name="line5" sortable :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                <el-table-column prop="desc" label="备注" class-name="line6" sortable :show-overflow-tooltip=true>
                    <template slot-scope="scope">
                        <div class="father">
                            <p>{{scope.row.desc}}</p>
                            <input type="text" @blur="upSeat(scope.$index, scope.row,'desc')" v-model="scope.row.desc">
                        </div>
                    </template>
                </el-table-column>
                
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text" 
                        @click="handlereset(scope.$index, scope.row)">重置密码</el-button>&#12288;|
                        <el-button size="mini"  type="text" v-clipboard:copy="message" @click="handlecopy(scope.$index, scope.row,$event)">
                            复制信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Dialog :message='message' :type='dialog_type' :show="dialog_show" :checkall="checkbox"></Dialog>
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
    .grey{
        color: #999;
        font-size: 12px;
    }
    .black{
        color: #444;
        font-size: 12px;
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
    .part1_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .search{
        float: left;
        width: 200px;
        font-size: 12px;
    }
    .part1_tit .button{
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
    .worker_active{
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
    .father input{
        display:none;
        font-size: 12px;
        color: #555;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
        padding: 2px;
    }
    .father select{
        display:none;
        font-size: 12px;
        color: #555;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
        padding: 2px;
    }
    .father p{
        margin: 0;
    }
    .father:hover input,.father:hover select{
        display:block ;
    }
    .father:hover p{
        display:none ;
    }
    
    #operate{
        margin:20px 0;
        overflow: hidden;
    }
    #operate p{
        float: left;
        margin: 8px;
        line-height: 29px;
    }
    #operate .button{
        float: left;
        margin: 8px;
    }
</style>

<script>
import Dialog from "./component/dialog_worker.vue"
import jsonfy from "./jsonfy.js"
export default {
    name:'worker',
    data:function(){
        return {
            worker_state:'',
            search_state:false,
            search_date:[],
            search:'',
            tableData:[],
            multipleSelection: [],
            message:[],
            dialog_type:'0',
            dialog_show:false,
            checkbox:false,
        }
    },
    methods:{
        worker_change:function(value){
            this.worker_state=value;
        },
        search_change:function(value){
            this.search_state=value;
        },
        handlecopy(index, row,e){
            this.message=[{'id':row.loginName,'name':row.shortName,'password':row.passowrd}];
            this.dialog_type=0;
            this.checkbox=false;
            this.dialog_show=true;
        },
        handlereset(index, row,e){
            this.message=[{'id':row.loginName,'name':row.shortName,'password':row.passowrd}];
            this.dialog_type=1;
            this.checkbox=false;
            this.dialog_show=true;
        },
        selectcopy:function(){
            if(this.multipleSelection.length>0){
                this.message=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    this.message.push({'id':this.multipleSelection[i].loginName,'name':this.multipleSelection[i].shortName,'password':this.multipleSelection[i].passowrd})
                }
                this.dialog_type=0;
                this.checkbox=true;
                this.dialog_show=true;
            }
        },
        selectreset:function(){
            if(this.multipleSelection.length>0){
                this.message=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    this.message.push({'id':this.multipleSelection[i].loginName,'name':this.multipleSelection[i].shortName,'password':this.multipleSelection[i].passowrd})
                }
                this.dialog_type=1;
                this.checkbox=true;
                this.dialog_show=true;
            }
        },
        handleSelectionChange:function(val){
            this.multipleSelection = val;
            this.dialog_show=false;
        },
        reset:function(){
            this.dialog_show=false;
        },
        findSeat:function(){
            var data={
                'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:""
            };
            this.$ajax.post('/new/account/findSeatList',data)
            .then( (res) => {
                this.tableData=res.data.rows;
            })
            .catch(res=>{
                console.log(res)
            })
        },
        upSeat:function(index,row,item){
            var item=item;
            var changeitem=row[item];
            var data={
                'id':row.id
            };
            jsonfy.jsonfy(data,item,changeitem);
            this.$ajax.post('/new/account/updateSeat',data)
            .then( (res) => {
                if(res.code==200){
                    window.reload()
                }
            })
            .catch(res=>{
                alert('修改失败哦')
            })
        }
    },
    components:{
        Dialog
    },
    mounted:function(){
        var data={
            'name':'qy1','password':'123456','password2':'123456'
        };
        this.$ajax.post('/new/loginValidate',
            data
        );
        this.$ajax.post('/new/account/findSeatList')
        .then( (res) => {
            this.tableData=res.data.rows;
        })
        .catch(res=>{
            console.log(res)
        })
    }
}
</script>