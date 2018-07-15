<template>
    <div class="container" @contextmenu='prevent($event)' v-on:click.capture="contextmenu.state=false">
        <div v-show="contextmenu.state" class="contextmenu" :style="{'position':'absolute','left':contextmenu.left+'px','top':contextmenu.top+'px','z-index':'3','width':'150px','line-height':'30px','background':'#fff','border':'1px solid #ccc','border-radio':'3px','box-shadow':'0px 0px 4px #ccc','cursor':'pointer'}" @click="remove">移除该呼叫任务</div>
        <div class="aside">
            <div class="tit">
                <el-button type="primary" size="mini" icon="el-icon-sort" :style="{'float':'left','margin':'8px 5%'}">在线</el-button>
                <el-button type="info" size="mini" :style="{'float':'right','margin':'8px 5%'}">自动呼叫</el-button>
                <el-input size="small" :style="{'width':'90%'}" class="search"
                    placeholder="按客户姓名或手机号搜索"
                    prefix-icon="el-icon-search"
                    v-model="search">
                </el-input>
                <ul>
                    <li>待呼叫</li>
                    <li>已预约</li>
                    <li>来电</li>
                </ul>
            </div>
            <div class="con">
                <el-tree
                class="staff"
                :data="data"
                :props="defaultProps"
                accordion
                @node-click="handleNodeClick">
                </el-tree>
            </div>
            <ul class="foot">
                <li class="grey"><i class="el-icon-plus"></i>新增呼叫计划</li>
            </ul>
        </div>
        <div class="body">
            <div class="head">
                <div class="mes2">
                    <div id="call">
                        <div class="call_state" v-show="call_state==0">
                            <i class="el-icon-phone call_icon"></i>
                        </div>
                        <div v-show="call_state==1">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone-outline call_icon"></i>
                                呼叫中
                            </div>
                            <i class="el-icon-more call_icon"></i>
                            <i class="el-icon-service call_icon"></i>
                        </div>
                        <div v-show="call_state==2&&call_success==0">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                通话中  <span :style="{'font-size':'12px'}">1:12:11</span>
                            </div>
                            <i class="el-icon-more call_icon"></i>
                            <i class="el-icon-service call_icon"></i>
                        </div>
                        <div v-show="call_state==2&&call_success==1">
                            <div class="call_state">
                                <i class="el-icon-phone call_icon"></i>
                            </div>
                            <span>刚刚 被挂断</span>
                        </div>
                        <div v-show="call_state==2&&call_success==2">
                            <div class="call_state">
                                <i class="el-icon-phone call_icon"></i>
                            </div>
                            <span>刚刚 未接听</span>
                        </div>
                        <div v-show="call_state==2&&call_success==3">
                            <div class="call_state">
                                <i class="el-icon-phone call_icon"></i>
                            </div>
                            <span>刚刚 无法接通</span>
                        </div>
                        <div v-show="call_state==2&&call_success==4">
                            <div class="call_state">
                                <i class="el-icon-phone call_icon"></i>
                            </div>
                            <span>空号/号码有误</span>
                        </div>
                        <div v-show="call_state==3">
                            <div class="call_state">
                                <i class="el-icon-phone call_icon"></i>
                            </div>
                            <span>刚刚 通话 3分11秒</span>
                        </div>
                    </div>
                    <p class="black" :style="{'font-weight':'700'}">{{name}}</p>
                    <p class="black">{{phone}}</p>
                    
                </div>
                <div class="mes3">
                    <div class="mes">
                        <div class="grey">性别：<div class="father"><span class="black">{{sex}}</span><input type="text" v-model="sex"></div></div>
                        <div class="grey">职业：<div class="father"><span class="black">{{job}}</span><input type="text" v-model="job"></div></div>
                        <div class="grey">意向：<div class="father"><span class="black">{{think}}</span><input type="text" v-model="think"></div></div>
                    </div>
                    <div class="mes">
                        <div class="grey">邮箱：<div class="father"><span class="black">{{email}}</span><input type="text" v-model="email"></div></div>
                        
                        <div class="grey">公司：<div class="father"><span class="black">{{company}}</span><input type="text" v-model="company"></div></div>
                    </div>
                </div>
                
            </div>
            <div class="summary">
                <p class="black tit">通话小结</p>
                <div>
                    <div class="state">
                        <p class="grey">跟进状态</p>
                        <p class="black see" v-for=" item in worker_list" :key="item.key" :class="{see_active:worker_state==item.key}" @click="worker_change(item.key)">{{item.value}}</p>
                        <div class="grey">下次联系时间：<el-date-picker v-model="time_next" type="datetime" placeholder="无" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker"> </el-date-picker></div>
                    </div>
                </div>
                <div class="tag">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">客户标签</p>
                    <el-tree :data="tag_data" :props="defaultProps" @node-click="handleNodeClick" accordion>
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
                <div class="note">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                    <el-input :style="{'width':'80%','float':'left'}"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="note">
                    </el-input>
                </div>
                <div class="submit">
                    <p class="grey">提交小结后将自动呼叫下一位客户</p>
                    <el-button type="info" size="mini" :style="{'background':'#7496F2','border-color':'#fff'}">提交小结</el-button>
                </div>
            </div>
            <div class="history">
                <div :style="{'overflow':'hidden'}">
                    <p class="black tit" :style="{'float':'left'}">历史通话记录&#12288;<span class='grey'>总联系{{history.call_total}}次，有效联系{{history.call_success}}次</span></p>
                <p class="grey" :style="{'float':'right'}">查看更多<i class="el-icon-d-arrow-right"></i></p>
                </div>
                <p class="grey" id="talk">{{history.current_time}}&#12288;&#12288;{{history.worker}} <span class="black">通话</span> {{history.state}}</p>
                <div>
                    <div class="state">
                        <p class="grey">跟进状态</p>
                        <el-button type="info" size="mini" :style="{'background':'#f4f4f4','border-color':'#f4f4f4','color':'#7496F2','float':'left'}" round>{{history.custom_state}}</el-button>
                        <!-- <p class="black">{{history.custom_state}}</p> -->
                        <div class="grey" :style="{'margin-left':'45%'}"><p :style="{'float':'left'}">下次联系时间：</p><el-button type="info" size="mini" :style="{'background':'#f4f4f4','border-color':'#f4f4f4','color':'#7496F2','float':'left'}" round>{{history.next_time}}</el-button></div>
                    </div>
                </div>
                <div class="tag">
                    <el-button type="info" size="mini" v-for="item in history.tag" :key="item" :style="{'background':'#7496F2','border-color':'#fff'}" round>{{item}}</el-button>
                </div>
                <div class="note">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                    <p :style="{'margin':'3px 7px','text-align':'left'}">{{history.note}}</p>
                </div>
            </div>
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
    div{
        font-size: 13px;
    }
    .grey{
        color: #999;
        font-size: 12px;
    }
    .black{
        color: #444;
        font-size: 13px;
    }
    .date_picker{
        position: relative;
    }
    .container{
        height: 100%;
        overflow: hidden;
        background: #F2F4F5;
    }
    .aside{
        float: left;
        width: 25%;
        height: 100%;
        position: relative;
        border: 1px solid #ccc;
        background: #fff;
    }
    .aside .con{
        min-height: 60vh;
    }
    .aside .tit{
        padding-top: 8px;
    }
    .tit ul{
        width: 100%;
        margin: 0;
    }
    .tit ul li{
        width: 33%;
        float: left;
        margin: 12px 0;
    }
    .aside .foot{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin: 0;
    }
    .aside .foot li{
        width: 49%;
        float: left;
        margin: 8px 0;
        color: #7496F2;
    }
    .body{
        padding-left: 27%;
        box-sizing: border-box;
        
    }
    .body .head,.body .summary{
        overflow: hidden;
    }
    .body .summary{
        background-color: #fff;
        margin-right: 8px;
        padding-left: 20px;
        padding-right: 20px;
    }
    .body .history{
        padding-left: 20px;
        padding-right: 20px;
        background-color: #fff;
        margin-top: 10px;
        margin-right: 8px;
        text-align: left;
    }
    .mes3{
        overflow: hidden;
        text-align: left;
        float: left;
        width: 57%;
        margin: 8px 2%;
        background-color: #fff;
        padding: 0 8px;
    }
    .mes2{
        overflow: hidden;
        text-align: left;
        float: left;
        width: 37%;
        margin: 8px 0;
        background-color: #fff;
    }
    .mes2>p{
        padding:0 10px;
    }
    .mes{
        overflow: hidden;
        padding: 10px 0;
        text-align: left;
        width: 50%;
        float: left;
    }
    .father{
        display: inline;
    }
    .father input{
        display:none;
        font-size: 12px;
        color: #555;
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
    .father:hover input,.father:hover select{
        display:inline ;
    }
    .father:hover span{
        display:none ;
    }
    .summary .tit{
        font-weight: 700;
        text-align: left;
    }
    .see{
        background: #CDCDCD;
        color: #fff;
        border-radius: 3px;
        padding: 0 4px;
    }
    .see_active{
        background: #7496F2;
    }
    .summary .state,.summary .tag{
        overflow: hidden;
        padding: 8px 0;
    }
    .history .state,.history .tag{
        overflow: hidden;
        padding: 8px 0;
        text-align: left;
    }
    .note{
        padding: 8px 0;
        overflow: hidden;
    }
    .state p{
        float: left;
        line-height: 28px;
        margin:0px 4px;
    }
    .submit{
        padding: 8px 0;
        text-align: right;
    }
    .submit p{
        display: inline-block;
    }
    #talk{
        text-align: left;
        background-color: #f5f5f5;
        padding: 4px 8px;
        display: inline-block;
        border-radius: 16px;
    }
    #call{
        float: right;
    }
    .call_icon{
        font-size: 20px;
    }
    .call_state{
        height: 30px;
        margin-top:20px;
        color: #fff;
        min-width: 30px;
        background-color: rgba(0, 204, 102, 1);
        line-height: 34px;
        border-radius: 30px;
        text-align: center;
        display: inline-block;
    }
</style>
<style>
.staff .el-tree-node{
    float:unset;
}
.staff .el-tree-node__children{
    max-height: 50vh;
    overflow-y: auto;
}
.staff .el-tree-node__children::-webkit-scrollbar-track
{
    background-color: #F5F5F5;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
}
/*定义滚动条高宽及背景*/
.staff .el-tree-node__children::-webkit-scrollbar
{
    width: 4px;
    background-color: rgba(153, 153, 153, 0.8);
}
/*定义滚动条*/
.staff .el-tree-node__children::-webkit-scrollbar-thumb
{
    background-color: #8b8b8b;
    border-radius: 1px;
}
.search>input{
    background: #F4F4F4;
}
</style>

<script>
export default {
    name:'Staff_stage',
    data:function(){
        return {
            search:'',
            call_state:0,
            call_success:0,
            activeIndex:'1',
            worker_list:[{'key':'0','value':'发展成功'},{'key':'1','value':'持续跟进'},{'key':'2','value':'发展失败'}],
            data: [{
                label: '一级 1',
                id:1,
                children: [{
                    label: '二级 1-1',
                    id:11
                },{
                    label: '二级 1-1',
                    id:12
                },{
                    label: '二级 1-1',
                    id:13
                },{
                    label: '二级 1-1',
                    id:14
                },{
                    label: '二级 1-1',
                    id:15
                },{
                    label: '二级 1-1',
                    id:16
                },{
                    label: '二级 1-1',
                    id:17
                },{
                    label: '二级 1-1',
                    id:18
                }]
                }, {
                label: '一级 2',
                id:2,
                children: [{
                    label: '二级 2-1',
                    id:21
                }, {
                    label: '二级 2-2',
                    id:22
                }]
                }, {
                label: '一级 3',
                id:3,
                children: [{
                    label: '二级 3-1',
                    id:31
                }, {
                    label: '二级 3-2',
                    id:32
                }]
            }],
            defaultProps: {
            children: 'children',
            label: 'label'
            },
            name:'未知客户',
            phone:'13933337767',
            sex:'女',
            job:'设计师',
            company:'网易(杭州)网络有限公司',
            email:'hzfuwenjuan@corp.nete',
            think:'待添加',
            worker_state:0,
            time_next:'',
            tag_data: [{
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
            label_list:[],
            tag_list:[],
            note:'',
            history:{
                call_total:'10',
                call_success:'6',
                worker:'陈晓花',
                state:'23分23秒',
                custom_state:'继续跟进',
                current_time:'6月11日 12:23',
                next_time:'6月14日 12:00',
                note:'意向不是特别明显意向不是特别明显意向不是特别明显意向不是特别明显意向不是特别明显意向不是特别明显意向不是特别明显',
                tag:[
                    '重点跟进客户',
                    '21-30岁',
                    '经济实力强'
                ]
            },
            contextmenu:{state:false,left:'',top:'',target:''}
        }
    },
    mounted() {
        this.$emit("close");
        console.log(document,document.title);
    },
    methods:{
        handleNodeClick(data) {
            console.log(data);
        },
        handleSelect(){
            
        },
        worker_change:function(value){
            this.worker_state=value;
        },
        handleNodeClick(data) {
            this.label_list[data.group]=data.id;
            this.tag_list[data.group]=data.label;
        },
        prevent:function(e){
            if(e.target.getAttribute('class').indexOf('el-tree-node__content')!=-1){
                e.preventDefault();
                this.contextmenu.state=true;
                this.contextmenu.left=e.clientX;
                this.contextmenu.top=e.clientY;
                this.contextmenu.target=e.target;
            }else{
                this.contextmenu.state=false;
            }
        },
        remove(){
            this.contextmenu.target.style.display='none';
            this.contextmenu.state=false;
        }
    }
}
</script>

