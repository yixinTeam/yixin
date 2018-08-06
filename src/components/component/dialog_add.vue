<template>
    <div >
      <el-dialog title="新增呼叫计划" :visible.sync="see" @close="close" center @open="open" width="850px">
        <div class="container">
            <div class="part2">
                <div class="part2_tit">
                    <el-input
                        placeholder="按任务名称搜索"
                        prefix-icon="el-icon-search"
                        v-model="search" class="search" size="mini">
                    </el-input>
                    <el-button type="info" class="button" :style="{float:'left'}" @click="missoin_search">搜索</el-button>
                </div>
                <div class="zhankai" v-if="search_state==false">
                    <el-button type="info" plain class="button" @click="search_change(true)">收起</el-button>
                    <div>
                        <p class="grey">任务名称&#12288;&#12288;</p>
                        <!-- <p class="black" v-for=" (item,index) in mission_list" :key="item.taskId" :class="{see_active:mission_state==index}" @click="mission_change(index)">{{item.taskName}}</p> -->
                        <p class="black" v-for=" (item,index) in mission_list" :key="index" :class="{see_active:mission_state.indexOf(index)!=-1}" @click="mission_change(index)">{{item.taskName}}</p>
                    </div>
                    <div>
                        <p class="grey">客户状态&#12288;&#12288;</p>
                        <!-- <p class="black" v-for=" (item,index) in custom_list" :key="index" :class="{see_active:custom_state==index}" @click="custom_change(index)">{{item.value}}</p> -->
                        <p class="black" v-for=" (item,index) in custom_list" :key="index" :class="{see_active:custom_state.indexOf(index)!=-1}" @click="custom_change(index)">{{item.value}}</p>
                    </div>
                    <div>
                        <p class="grey">最近通话情况</p>
                        <!-- <p class="black" v-for=" (item,index) in call_list" :key="index" :class="{see_active:call_state==index}" @click="call_change(index)">{{item.value}}</p> -->
                        <p class="black" v-for=" (item,index) in call_list" :key="index" :class="{see_active:call_state.indexOf(index)!=-1}" @click="call_change(index)">{{item.value}}</p>
                    </div>
                    <div>
                        <p class="grey">联系情况&#12288;&#12288;</p>
                        <p class="black" v-for=" (item,index) in link_list" :key="index" :class="{see_active:link_state==index}" @click="link_change(index)">{{item.value}}</p>
                    </div>
                    <div>
                        <p class="grey">客户标签&#12288;&#12288;</p>
                        <el-dropdown :hide-on-click="false" v-for="(item,index) in tag_data" :key="index"  @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{item.tagName}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(_item,_index) in item.tags" :key="_index" :command="{'index':index,'value':_item}">{{_item}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-tree
                        :data="tag_data"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                        </span>
                        </el-tree> -->
                    </div>
                </div>
                <div class="zhankai shouqi" v-if="search_state">
                    <el-button type="info" plain class="button" @click="search_change(false)">展开</el-button>
                    <div>
                        <p class="grey">筛选条件</p>
                        <!-- <p class="black see_active">任务名称：{{mission_list[mission_state].taskName}}</p> -->
                        <p class="black see_active">任务名称：<span v-for="(item,index) in mission_state" :key="index">{{mission_list[item].taskName}};</span></p>
                        <!-- <p class="black see_active">客户状态：{{custom_list[custom_state].value}}</p> -->
                        <p class="black see_active">客户状态：<span v-for="(item,index) in custom_state" :key="index">{{custom_list[item].value}};</span></p>
                        <!-- <p class="black see_active">最近通话情况：{{call_list[call_state].value}}</p> -->
                        <p class="black see_active">最近通话情况：<span v-for="(item,index) in call_state" :key="index">{{call_list[item].value}};</span></p>
                        <p class="black see_active">联系情况：{{link_list[link_state].value}}</p>
                        <p class="black see_active" v-if="tags.length>0">客户标签：<span  v-for="item in tags" :key="item">{{item.value}}&#12288;</span></p>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                    <el-table-column prop="userName" label="客户姓名" class-name="line2"  :show-overflow-tooltip=true min-width="80"> </el-table-column>
                    <el-table-column prop="userNumber" label="手机号" class-name="line3" :show-overflow-tooltip=true min-width="100"> </el-table-column>
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
                </el-table>
                <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
                </el-pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="see=false" size="small">&#12288;&#12288;取消&#12288;&#12288;</el-button>
            <el-button type="info" @click="save" size="small">生成呼叫计划</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
    }
    .part2_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .part2_tit .button{
        float: left;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
    }
    .search{
        float: left;
        width: 200px;
        font-size: 12px;
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
    name:'dialog-add',
    data:function(){
        return {
            search:'',
            mission_list:[],
            mission_state:[0],
            custom_state:[0],
            //0：预留 1：继续跟进 2：发展成功 3：发展失败
            custom_list:[{'key':'','value':'全部'},{'key':'1','value':'持续跟进'},{'key':'2','value':'发展成功'},{'key':'3','value':'发展失败'}],
            search_state:false,
            //呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 
            call_list:[{'key':'','value':'全部'},{'key':'0','value':'未开始'},{'key':'10','value':'正常通话'},{'key':'11','value':'转给其他坐席'},{'key':'12','value':'转值班电话'},{'key':'21','value':'没坐席接听'},{'key':'22','value':'未接通'}],
            call_state:[0],
            //全部：0；今日未联系：1；
            link_list:[{'key':'0','value':'全部'},{'key':'1','value':'今日未联系'}],
            link_state:0,
            tag_data:[],
            tags:[],
            tableData: [],
            page_count:0,
            pageNum:1
        }
    },
    props:['see'],
    methods:{
        close:function(){
            this.$emit("reset");
            
        },
        open(){
            this.$ajax.post(this.$preix+'/new/tag/findTagList')
            .then( (res) => {
                if(res.data.code==200){
                    for(let i=0;i<res.data.info.length;i++){
                        res.data.info[i].tags=res.data.info[i].tagValue.split(';');
                    }
                    this.tag_data=res.data.info;
                }
            });
            this.$ajax.post(this.$preix+'/new/calltask/queryTaskIntroOnWallBySeat',{'pageSize':100})
            .then( (res) => {
                if(res.data.code==200){
                    res.data.rows.splice(0,0,{'taskName':'全部','taskId':''});
                    res.data.rows.map((value, index)=>value.key=index);
                    this.mission_list=res.data.rows;
                }
            });
            var data={"requireTotalCount" : true};
            this.mission_init(data);
        },
        //条件搜索
        missoin_search:function(){
            let taskIds=this.mission_state.map((item)=>this.mission_list[item].taskId);
            let userResults=this.custom_state.map((item)=>this.custom_list[item].key);
            let callResults=this.call_state.map((item)=>this.call_list[item].key);
            var data={'userResults':userResults,'nameOrNumber':this.search,'taskIds':taskIds,'callResults':callResults,'whetherCalledToday':this.link_list[this.link_state].key,"requireTotalCount" : true,'pageNum':this.pageNum};
            // for(let i=0;i<this.tags.length;i++){
            //     if(this.tags[i]!=null||this.tags[i]!=undefined){
            //         var str='customTag'+(i+1);
            //         data[str]=this.tags[i].value;
            //     }
            // }
            //删除空属性
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
        },
        //查询任务信息
        mission_init(data){
            this.$ajax.post(this.$preix+'/new/seatWorkbench/findCallPlanList',data)
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
            let taskIds=this.mission_state.map((item)=>this.mission_list[item].taskId);
            let userResults=this.custom_state.map((item)=>this.custom_list[item].key);
            let callResults=this.call_state.map((item)=>this.call_list[item].key);
            var data={'userResults':userResults,'nameOrNumber':this.search,'taskIds':taskIds,'callResults':callResults,'whetherCalledToday':this.link_list[this.link_state].key,"requireTotalCount" : true,'pageNum':this.pageNum};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.mission_init(data);
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
            this.missoin_search();
        },
        search_change:function(value){
            this.search_state=value;
            this.missoin_search();
        },
        custom_change:function(value){
            if(this.custom_state.indexOf(value)==-1&&value!=0){
                this.custom_state.push(value);
                for(let i in this.custom_state){
                    if(this.custom_state[i]==0){
                        //delete this.custom_state[i];
                        this.custom_state.splice(i,1);
                    }
                }
            }else if(this.custom_state.indexOf(value)!=-1&&this.custom_state.length>1){
                var index=this.custom_state.indexOf(value);
                this.custom_state.splice(index,1);
            }else if(value==0){
                this.custom_state=[0];
            }
            this.missoin_search();
        },
        call_change:function(value){
            if(this.call_state.indexOf(value)==-1&&value!=0){
                this.call_state.push(value);
                for(let i in this.call_state){
                    if(this.call_state[i]==0){
                        //delete this.call_state[i];
                        this.call_state.splice(i,1);
                    }
                }
            }else if(this.call_state.indexOf(value)!=-1&&this.call_state.length>1){
                var index=this.call_state.indexOf(value);
                this.call_state.splice(index,1);
            }else if(value==0){
                this.call_state=[0];
            }
            this.missoin_search();
        },
        link_change:function(value){
            this.link_state=value;
            this.missoin_search();
        },
        save(){
            this.$ajax.post(this.$preix+'/new/seatCallTask/genSeatCallList').then(res=>{
                console.log(res);
                if(res.data.code==200){
                    this.see=false;
                    this.reload();
                }
            })
        },
        handleCommand(command) {
            this.tags[command.index]={'value':command.value};
        }
    },
    inject:['reload']
}
</script>
