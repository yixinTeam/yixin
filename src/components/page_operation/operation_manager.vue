<template>
    <div class="container">
        <div class="part1">
            <div class="part1_tit">
                <el-input
                    placeholder="企业名称或邮箱账号搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="info" class="button" :style="{float:'left'}" @click="findSeat">搜索</el-button>
                <el-button type="info" plain class="button" @click="fsAdd">新增FS账号</el-button>
                <el-button type="info"  class="button" @click="managerAdd">新增企业</el-button>
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
                    <p class="black worker_active" v-show="worker_state==3">停用</p>
                    <p class="black worker_active" v-show="worker_state==2">冻结</p>
                    <p class="black worker_active" v-show="worker_state==1">激活</p>
                    <el-tag type="info" class="tag" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" @sort-change="sort_change" class="table" header-row-class-name="table_head">
                <el-table-column prop="loginName" label="管理账号" class-name="line1" label-class-name="line1_tit" sortable='custom' :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <router-link :to="{path:'/operation/staff',query:{partnerAccountId:scope.row.id}}">
                            <span>{{scope.row.loginName}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="fullName" label="企业名称" class-name="line2" sortable='custom' :show-overflow-tooltip=true min-width="100"></el-table-column>
                <el-table-column prop="email" label="邮箱" class-name="line3" sortable='custom' :show-overflow-tooltip=true min-width="120">
                </el-table-column>
                <el-table-column prop="seatAccountPrefix" label="坐席账号前缀" class-name="line4" sortable='custom' :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                <el-table-column prop="callCredit" label="信用资源" class-name="line5" :show-overflow-tooltip=true  min-width="100"> </el-table-column>
                <el-table-column prop="callRemaining" label="实时资源" class-name="line5" :show-overflow-tooltip=true  min-width="100"> </el-table-column>
                <el-table-column prop="create" label="创建日期" class-name="line5" :show-overflow-tooltip=true  min-width="100"> </el-table-column>
                <el-table-column prop="state" label="状态" class-name="line5" :show-overflow-tooltip=true  min-width="100">
                    <template slot-scope="scope">
                        <p class="black" v-show="scope.row==3">停用</p>
                        <p class="black" v-show="scope.row==2">冻结</p>
                        <p class="black" v-show="scope.row==1">激活</p>
                    </template>
                </el-table-column>
                <el-table-column prop="numOfSeat" label="坐席数量上限" class-name="line5" :show-overflow-tooltip=true  min-width="100"> </el-table-column>
                <el-table-column min-width="210" prop="desc" label="备注" class-name="line6" :show-overflow-tooltip=true>
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handleDetail(scope.$index, scope.row)">详情</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handlereset(scope.$index, scope.row)">重置密码</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handleAdd(scope.$index, scope.row)">生成坐席</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
            <Dialog :message='message' :type='dialog_type' :show="dialog_show" :checkall="checkbox" @close='close'></Dialog>
            <el-dialog :title="detail_type==0?'详情':'新增企业'" :visible.sync="see" center>
                <div class="con">
                    <el-form :model="Form" :rules="rules" ref="Form" label-width="120px" class="demo-ruleForm" size="mini">
                        <el-form-item label="管理员账号" prop="loginName">
                            <el-input v-model="Form.loginName"></el-input>
                        </el-form-item>
                        <el-form-item v-if="detail_type==1" label="密码" prop="password">
                            <el-input type="password" v-model="Form.password"></el-input>
                        </el-form-item>
                        <el-form-item v-if="detail_type==1" label="确认密码" prop="password2" required>
                            <el-input type="password" v-model="Form.password2"></el-input>
                        </el-form-item>
                        <el-form-item label="用户类型" prop="type">
                            <el-select v-model="Form.type" placeholder="请选择用户类型">
                                <el-option label="企业管理员" value="2"></el-option>
                                <el-option label="运维管理员" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="坐席账号前缀" prop="seatAccountPrefix">
                            <el-input v-model="Form.seatAccountPrefix"></el-input>
                        </el-form-item>
                        <el-form-item label="可配坐席数量" prop="numOfSeat">
                            <el-input v-model.number="Form.numOfSeat"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="Form.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model.number="Form.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="企业名称" prop="fullName">
                            <el-input v-model="Form.fullName"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="Form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="描述信息" prop="desc">
                            <el-input v-model="Form.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="信用资源" prop="callCredit">
                            <el-input v-model.number="Form.callCredit"></el-input>
                        </el-form-item>
                        <ul  v-show="detail_type==0">
                            <li>
                                <p class="black">实时资源：</p>
                                <div class="grey charge">2000分钟
                                    <el-button type="info" plain size="mini" id="charge" @click="charges=true">充值</el-button>
                                </div>
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
                    <el-button @click="resetForm('Form')" v-show="detail_type!=0">&#12288;重置&#12288;</el-button>
                    <el-button type="info" @click="submitForm('Form')">&#12288;提交&#12288;</el-button>
                </span>
            </el-dialog>
            <el-dialog title="充值" :visible.sync="charges" width="30%" center>
                <div>
                    <el-input v-model="charge_num" size="mini">
                        <template slot="prepend">输入你要充值的数量</template>
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="charges = false">取 消</el-button>
                    <el-button type="info" @click="charge">充 值</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<style scoped>
    .charge{
        height: 16px;
        transform: translateY(-4.5px);
    }
    #charge{
        position: relative;
        margin: 0 10px;
    }
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
    .part1_tit .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
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
</style>

<script>
import Dialog from "../component/dialog_worker.vue"
import jsonfy from "../jsonfy.js"
export default {
    name:'operation_manager',
    data:function(){
        //确认密码
        var validatePass= (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.Form.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            worker_state:'',
            search_state:false,
            search_date:[],
            search:'',
            tableData:[],
            message:[],
            checkbox:false,
            dialog_show:false,
            dialog_type:1,
            page_count:1,
            pageNum:1,
            orderWay:null,
            orderField:null,
            see:false,
            detail_type:0,
            charges:false,
            charge_num:null,
            Form: {
                loginName: null,
                password: null,
                password2: null,
                type: null,
                seatAccountPrefix: null,
                numOfSeat: null,
                email: null,
                phone: null,
                fullName: null,
                address: null,
                desc: null,
                callCredit:null
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入管理员账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择用户类型', trigger: 'change' }
                ],
                seatAccountPrefix: [
                    { required: true, message: '请输入坐席账号前缀', trigger: 'blur' }
                ],
                numOfSeat: [
                    { type: 'number', required: true, message: '请输入可配坐席数量', trigger: 'blur' }
                ],
                email: [
                    { type: 'email', required: false, message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                // phone: [
                //     { type: 'number',min: 9, max: 12, required: false, message: '请输入正确的手机号', trigger: 'blur' }
                // ],
                callCredit: [
                    { type: 'number', required: false, message: '请输入正确的信用资源', trigger: 'blur' }
                ]
            },
            active_data:null
        }
    },
    components:{Dialog},
    methods:{
        worker_change:function(value){
            this.worker_state=value;
            this.findSeat();
        },
        search_change:function(value){
            this.search_state=value;
            this.findSeat();
        },
        close(){
            this.dialog_show=false;
            this.findSeat();
        },
        manager_init(data){
            this.$ajax.post(this.$preix+'/new/account/findAdminList',data)
            .then( (res) => {
                this.tableData=res.data.rows;
                if(res.data.totalCount){
                    this.page_count=res.data.totalCount;
                }
            })
        },
        //条件搜索
        findSeat:function(){
            var data={
                'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search
            };
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.manager_init(data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.manager_init(data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]:"",'endTime':this.search_date!=null?this.search_date[1]:"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.manager_init(data);
        },
        handleDetail(index,row){
            console.log(row);
            this.active_data=row;
            this.$ajax.post(this.$preix+'/new/account/accountDetailView',{'id':row.id}).then(res=>{
                if(res.data.code==200){
                    this.Form=res.data.info;
                }
            })
            this.see=true;
            this.detail_type=0;
        },
        handlereset(index,row){
            this.message=[];
            this.$ajax.post(this.$preix+'/new/account/resetPassword',{'id':row.id})
            .then( (res) => {
                this.message=res.data.info;
                this.dialog_type=1;
                this.checkbox=false;
                this.dialog_show=true;
            })
        },
        handleAdd(index,row){
            this.$ajax.post(this.$preix+'/new/account/createSeatList',{'id':row.id})
            .then( (res) => {
                if(res.data.code==200){
                    this.$message({
                        showClose: true,
                        message: '生成成功',
                        type: 'success'
                    });
                }
            })
        },
        managerAdd(){
            for(let key in this.Form){
                this.Form[key]=null;
            }
            this.see=true;
            this.detail_type=1;
        },
        fsAdd(){
            this.$ajax.post(this.$preix+'/account/createSeatList')
            .then( (res) => {
                if(res.data.code==200){
                    this.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    });
                }
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
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
                    this.$ajax.post(this.$preix+'/new/account/addOrUpdateAccount',data)
                    .then( (res) => {
                        if(res.data.code==200){
                            _this.reload()
                        }else{
                            alert(res.data.message)
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //充值
        charge(){
            this.$ajax.post(this.$preix+'/new/account/updateCompanyCallRemaining',{'accountPid':this.active_data.id,'callRemaining':this.charge_nums})
            .then( (res) => {
                if(res.data.code==200){
                    this.charges=false;
                }
            })
            
        }
    },
    mounted:function(){
        this.manager_init({requireTotalCount:true});
    },
    inject:['reload']
}
</script>