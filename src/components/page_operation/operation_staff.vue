<template>
    <div class="container">
        <div class="part1">
            <div class="part1_tit">
                <el-input
                    placeholder="按坐席昵称或账号搜索"
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
                    @change="date_change"
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
                    <p class="black worker_active" v-show="worker_state==3">停用</p>
                    <p class="black worker_active" v-show="worker_state==2">冻结</p>
                    <p class="black worker_active" v-show="worker_state==1">激活</p>
                    <el-tag type="info" class="tag" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <div id="operate">
                <p>选中{{multipleSelection.length}}个坐席</p>
                <el-button type="info" size="mini" class="button" @click="selectreset">重置密码</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" @sort-change="sort_change" class="table" @selection-change="handleSelectionChange" header-row-class-name="table_head">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="loginName" label="坐席账号" class-name="line1" label-class-name="line1_tit" sortable='custom' :show-overflow-tooltip=true min-width="120">
                    <!-- <template slot-scope="scope">
                        <router-link :to="{path:'./detail', query: { id: '111' }}">
                            {{scope.row.loginName}}
                        </router-link>
                    </template> -->
                    <template slot-scope="scope">
                        <p :style="{'color':'#3399ff'}" @click="handleDetail">
                            {{scope.row.loginName}}
                        </p>
                    </template> 
                </el-table-column>
                <el-table-column prop="shortName" label="坐席昵称" class-name="line2" sortable='custom' :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p>{{scope.row.shortName}}</p>
                            <input type="text" @blur="upSeat(scope.$index, scope.row,'shortName')" v-model="scope.row.shortName">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="坐席状态" class-name="line3" sortable='custom' :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p v-show="scope.row.state==1">激活中</p>
                            <p v-show="scope.row.state==2">已冻结</p>
                            <p v-show="scope.row.state==3">已停用</p>
                            <select v-model="scope.row.state" @change="state_select(scope.row,scope.row.state)">
                                <option value="3">已停用</option>
                                <option value="2">已冻结</option>
                                <option value="1">激活中</option>
                            </select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="create" label="创建时间" class-name="line4" sortable='custom' :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                <el-table-column prop="recentCallTime" label="最近通话" class-name="line5" :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                <el-table-column prop="desc" label="备注" class-name="line6" :show-overflow-tooltip=true>
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
                        @click="handlereset(scope.$index, scope.row)">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
            <Dialog :message='message' :type='dialog_type' :show="dialog_show" :checkall="checkbox" @close='close'></Dialog>
            <el-dialog title="详情" :visible.sync="see" center>
                <div class="con">
                    <el-form :model="Form" :rules="rules" ref="Form" label-width="120px" class="demo-ruleForm" size="mini">
                        <el-form-item label="账号" prop="loginName">
                            <el-input v-model="Form.loginName"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="shortName">
                            <el-input v-model="Form.shortName"></el-input>
                        </el-form-item>
                        <el-form-item label="账号状态" prop="state">
                            <el-select v-model="Form.state" placeholder="请选择账号状态">
                                <el-option label="激活" value="1"></el-option>
                                <el-option label="冻结" value="2"></el-option>
                                <el-option label="停用" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <ul>
                            <li>
                                <p class="black">实时资源：</p>
                                <div class="grey charge">2000分钟</div>
                            </li>
                            <li>
                                <p class="black">id：</p>
                                <div class="grey">0edafda9-57d3-48e5-9cad-88041ca2a4a4</div>
                            </li>
                            <li>
                                <p class="black">创建日期：</p>
                                <div class="grey">2018-03-23 11:53:05</div>
                            </li>
                            <li>
                                <p class="black">更新日期：</p>
                                <div class="grey">2018-06-29 13:54:34</div>
                            </li>
                            <li>
                                <p class="black">手机：</p>
                                <div class="grey">13325717959 </div>
                            </li>
                            <li>
                                <p class="black">token：</p>
                                <div class="grey">zwwqy</div>
                            </li>
                        </ul>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="see=false">&#12288;取消&#12288;</el-button>
                    <el-button type="info" @click="submitForm('Form')">&#12288;提交&#12288;</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<style scoped>
    ul{
        margin: 0;
        padding-top: 18px;
        border-top: 1px solid #e4e4e4;
    }
    li{
        margin-bottom: 18px;
    }
    li>p{
        width: 120px;
        text-align: right;
        float: left;
        margin: 0;
    }
    li>div{
        margin-left: 120px;
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
    .table{
        font-size: 14px;
        margin-bottom: 10px;
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
import Dialog from "../component/dialog_worker.vue"
import jsonfy from "../jsonfy.js"
export default {
    name:'operation_staff',
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
            page_count:1,
            pageNum:1,
            orderWay:null,
            orderField:null,
            see:false,
            Form: {
                loginName: null,
                shortName: null,
                state: null
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                shortName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        handleDetail(){
            this.see=true;
        },
        worker_change:function(value){
            this.dialog_show=false;
            this.worker_state=value;
            this.findSeat();
        },
        date_change(){
            this.findSeat();
        },
        search_change:function(value){
            this.search_state=value;
        },
        close(){
            this.dialog_show=false;
        },
        //
        handlereset(index, row,e){
            this.message=[];
            this.$ajax.post(this.$preix+'/new/account/batchUpdateSeat',[{'id':row.id,'password':'reset','shortName':row.shortName,'loginName':row.loginName}])
            .then( (res) => {
                if(res.data.code==200){
                    this.message=res.data.info;
                    this.dialog_type=1;
                    this.checkbox=false;
                    this.dialog_show=true;
                }
            })
        },
        selectreset:function(){
            if(this.multipleSelection.length>0){
                var data=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    data.push({'id':this.multipleSelection[i].id,'shortName':this.multipleSelection[i].shortName,'password':'reset','loginName':this.multipleSelection[i].loginName})
                }
                this.$ajax.post(this.$preix+'/new/account/batchUpdateSeat',data)
                .then( (res) => {
                    if(res.data.code==200){
                        console.log(res.data.info)
                        this.message=res.data.info;
                        this.dialog_type=1;
                        this.checkbox=true;
                        this.dialog_show=true;
                    }
                })
            }
        },
        handleSelectionChange:function(val){
            this.multipleSelection = val;
            this.dialog_show=false;
        },
        reset:function(){
            this.dialog_show=false;
        },
        seat_init(data){
            this.$ajax.post(this.$preix+'/new/account/findSeatList',data)
            .then( (res) => {
                if(res.data.code==200){
                    this.tableData=res.data.rows;
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                }
            })
        },
        //条件搜索
        findSeat:function(){
            var data={
                'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search,'partnerAccountId':this.$route.query.partnerAccountId
            };
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField,'partnerAccountId':this.$route.query.partnerAccountId};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField,'partnerAccountId':this.$route.query.partnerAccountId};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        upSeat:function(index,row,item){
            var item=item;
            var changeitem=row[item];
            var data={
                'id':row.id
            };
            jsonfy.jsonfy(data,item,changeitem);
            this.$ajax.post(this.$preix+'/new/account/updateSeat',data)
            .then( (res) => {
                if(res.data.code==200){
                    this.reload()
                }
            })
            .catch(res=>{
                alert('修改失败哦')
            })
        },
        state_select(row,state){
            this.$ajax.post(this.$preix+'/new/account/updateSeat',{'id':row.id,'state':state})
            .then( (res) => {
                if(res.data.code==200){
                    this.reload()
                }
            })
            .catch(res=>{
                alert('修改失败哦')
            })
        },
        submitForm(formName){
            console.log(this.$refs[formName]);
            var _this=this;
            var data=this.Form;
            for(let key in data){
                if(data[key]==null||data[key]==''){
                    delete data[key]
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$ajax.post(this.$preix+'/new/account/updateSeat',data)
                    .then( (res) => {
                        if(res.data.code==200){
                            _this.reload()
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    components:{
        Dialog
    },
    mounted:function(){
        var partnerAccountId=this.$route.query.partnerAccountId;
        if(partnerAccountId){
            this.seat_init({requireTotalCount:true,orderField:'create',orderWay:'desc',partnerAccountId:partnerAccountId});
        }else{
            this.seat_init({requireTotalCount:true,orderField:'create',orderWay:'desc'});
        }
        
    },
    inject:['reload']
}
</script>