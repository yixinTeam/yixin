<template>
    <div class="container" v-on:click.capture="hide">
        <!-- 蒙层 -->
        <div class="mask" v-show="call_state!=0">
            <div></div>
            <div :style="{'width':'65px','height':'100%'}"></div>
        </div>
        <div id="mask" v-show="call_state==5">
            <div>
                <p><i class="el-icon-success" :style="{'font-size':'20px'}"></i>提交成功，{{call_during}}秒后自动呼叫下一位客户</p>
                <span @click="stopCall">停止自动呼叫</span>
            </div>
        </div>
        <!-- 自定义右键菜单 -->
        <div v-show="contextmenu.state" class="contextmenu" :style="{'position':'absolute','left':contextmenu.left+'px','top':contextmenu.top+'px','z-index':'3','width':'150px','line-height':'30px','background':'#fff','border':'1px solid #ccc','border-radio':'3px','box-shadow':'0px 0px 4px #ccc','cursor':'pointer'}" @click="remove">移除该呼叫任务</div>
        <div class="aside">
            <div class="mask" :style="{'width':'100%','height':'100%'}" v-show="call_state!=0">
                <div :style="{'width':'50%','height':'100%'}"></div>
                <div :style="{'width':'50%','height':'100%','left':'50%','top':'53px'}"></div>
            </div>
            <div class="tit staff_stage_tit">
                <el-button type="info" size="mini" icon="el-icon-sort" :style="{'float':'left','margin':'8px 5%','border-color':'#fff'}" @click="online_change" :class="{call_active:online_state==0}"><span v-show="online_state==0">在线</span><span v-show="online_state==0.5">......</span><span v-show="online_state==1">离线</span></el-button>
                <div id="auto_call" @click.stop="call_set=true">
                    <el-button type="info" size="mini" :style="{'float':'right','margin':'8px 5%','border-color':'#fff'}" @click="call_set=!call_set" :class="{call_active:call_auto=='true'}">自动呼叫</el-button>
                    <div v-show="call_set">
                        <el-switch
                            v-model="call_auto"
                            active-color="#409EFF"
                            active-value="true"
                            inactive-value="false">
                            开启自动呼叫
                        </el-switch>
                        开启自动呼叫
                        <p class="black">每隔&nbsp;<el-input-number v-model="call_during" controls-position="right" :min="1" :max="10" size="mini"></el-input-number>&nbsp;秒自动呼叫下一位</p>
                    </div>
                </div>
                <el-input size="small" :style="{'width':'90%'}" class="search"
                    placeholder="输入客户姓名或手机号后回车进行搜索"
                    prefix-icon="el-icon-search"
                    v-model="search"  @keyup.enter.native="search_task()">
                </el-input>
                <ul>
                    <li @click="TaskList_init">待呼叫</li>
                    <li @click="BookedList_init({'requireTotalCount':true})">已预约</li>
                    <li>来电</li>
                </ul>
            </div>
            <div class="con">
                <el-tree class="staff" :data="TaskBySeat_data" :props="defaultProps" accordion @node-click="handleNodeClick" v-show="task_state==0" @scroll.native="test($event)">
                    <div class="custom-tree-node detail_init" slot-scope="{ node, data }" @click="detail_init(data,1)">
                        <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                        <p>{{ node.label}}</p>
                        <span>{{data.lastCalledTime}}</span>
                        <span>{{data.callResult==0?'':''}}</span>
                        <span>{{data.callResult==10?'通话':''}}</span>
                        <span>{{data.callResult==11?'被转移':''}}</span>
                        <span>{{data.callResult==21?'未接听':''}}</span>
                        <span>{{data.callResult==22?'未接通':''}}</span>
                        <span>{{data.areaName}}{{data.depName}}</span>
                    </div>
                </el-tree>
                <el-tree class="staff" :data="DialPlanIntroWithPage_data" :props="defaultProps" accordion @node-click="handleNodeClick" v-show="task_state==0&&DialPlanIntroWithPage_data.length!=0">
                    <div class="custom-tree-node detail_init" slot-scope="{ node, data }" @click="detail_init(data,2)" @contextmenu='prevent($event,data)'>
                        <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                        <p>{{ node.label}}</p>
                        <span>{{data.lastCalledTime}}</span>
                        <span>{{data.callResult==0?'':''}}</span>
                        <span>{{data.callResult==10?'通话':''}}</span>
                        <span>{{data.callResult==11?'被转移':''}}</span>
                        <span>{{data.callResult==21?'未接听':''}}</span>
                        <span>{{data.callResult==22?'未接通':''}}</span>
                        <span>{{data.areaName}}{{data.depName}}</span>
                    </div>
                </el-tree>
                <div class="custom-tree-node" v-show="task_state==1" v-for="(item,index) in booklist" :key="index" @click="detail_init(item)">
                    <p>{{item.userName}}</p>
                    <span>{{item.lastCalledTime}}</span>
                    <span>{{item.callResult==0?'':''}}</span>
                    <span>{{item.callResult==10?'通话':''}}</span>
                    <span>{{item.callResult==11?'被转移':''}}</span>
                    <span>{{item.callResult==21?'未接听':''}}</span>
                    <span>{{item.callResult==22?'未接通':''}}</span>
                    <span>{{item.areaName}}{{item.depName}}</span>
                </div>
            </div>
            <ul class="foot" @click="see=true">
                <li class="grey"><i class="el-icon-plus"></i>新增呼叫计划</li>
            </ul>
        </div>
        <div class="body">
            <div class="head">
                <div class="mes2">
                    <div id="call">
                        <div class="call_state" v-show="call_state==0" @click="startCall">
                            <i class="el-icon-phone call_icon" id="call_icon"></i>
                        </div>
                        <div v-show="call_state==1">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone-outline call_icon"></i>
                                <span>正在呼叫</span>
                            </div>
                            <i class="el-icon-more call_icon" @click="sipTerminate"></i>
                            <i class="el-icon-service call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==2">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone-outline call_icon"></i>
                                <span>&nbsp;呼叫中&nbsp;</span>
                            </div>
                            <i class="el-icon-more call_icon" @click="sipTerminate"></i>
                            <i class="el-icon-service call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==3">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <span>&nbsp;通话中&nbsp;</span> <span :style="{'font-size':'12px'}">{{timestr}}</span>
                            </div>
                            <i class="el-icon-more call_icon" @click="sipTerminate"></i>
                            <i class="el-icon-service call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==4">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone call_icon"></i>
                                <span>&nbsp;刚刚 通话 {{timestr2?timestr2:'0秒'}}&nbsp;</span>
                            </div>
                        </div>
                    </div>
                    <br><br>
                    <div class="father">
                        <p class="black" :style="{'font-weight':'700'}">{{name}}</p>
                        <input type="text" v-model="name" @blur="upSeat">
                    </div>
                    
                    <p class="black">{{phone}}</p>
                </div>
                <div class="mes3">
                    <div class="mes">
                        <div class="grey">性别：
                            <div class="father">
                                <span class="black" v-show="sex==undefined">不详</span>
                                <span class="black" v-show="sex==0">男</span>
                                <span class="black" v-show="sex==1">女</span>
                                <select v-model="sex" @change="upSeat">
                                    <option value="0">男</option>
                                    <option value="1">女</option>
                                </select>
                            </div>
                        </div>
                        <div class="grey">职业：
                            <div class="father">
                                <span class="black">{{job?job:'&#12288;'}}</span>
                                <input type="text" v-model="job" @blur="upSeat">
                            </div>
                        </div>
                        <div class="grey">意向：
                            <div class="father">
                                <span class="black">{{think?think:'待添加'}}</span>
                                <input type="text" v-model="think" @blur="upSeat">
                            </div>
                        </div>
                    </div>
                    <div class="mes">
                        <div class="grey">邮箱：
                            <div class="father">
                                <span class="black">{{email?email:'&#12288;'}}</span>
                                <input type="text" v-model="email" @blur="upSeat">
                            </div>
                        </div>
                        
                        <div class="grey">公司：
                            <div class="father">
                                <span class="black">{{company?company:'&#12288;'}}</span>
                                <input type="text" v-model="company" @blur="upSeat">
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="summary">
                <p class="black tit">通话小结</p>
                <div>
                    <div class="state">
                        <p class="grey">跟进状态</p>
                        <p class="black see" v-for=" item in worker_list" :key="item.key" :class="{see_active:worker_state==item.key}" @click="worker_change(item.key)">{{item.value}}</p>
                        <div class="grey">下次联系时间：<el-date-picker v-model="time_next" type="datetime" placeholder="无" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker></div>
                    </div>
                </div>
                <div class="tag">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">客户标签</p>
                    <el-dropdown :hide-on-click="false" v-for="(item,index) in tag_data" :key="index"  @command="handleCommand" :style="{'float':'left','line-height':'26px'}">
                        <span class="el-dropdown-link">
                            {{item.tagName}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(_item,_index) in item.tags" :key="_index" :command="{'index':index,'value':_item}">{{_item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
                    <el-button type="info" size="mini" :style="{'background':'#7496F2','border-color':'#fff'}" @click="update">提交小结</el-button>
                </div>
            </div>
            <div class="history">
                <div :style="{'overflow':'hidden'}">
                    <p class="black tit" :style="{'float':'left'}">历史通话记录&#12288;<span class='grey'>总联系{{history.historyDto.totalContactNum}}次，有效联系{{history.historyDto.effectiveContactNum}}次</span></p>
                <p class="grey" :style="{'float':'right'}" @click="enter(history.summaryDto)">查看更多<i class="el-icon-d-arrow-right"></i></p>
                </div>
                <p class="grey" id="talk">{{history.historyDto.details[0].callEndTime}}&#12288;&#12288;{{history.historyDto.details[0].shortName}} <span class="black">{{history.historyDto.details[0].callReaultString}}</span> {{history.historyDto.details[0].callDuration}}</p>
                <div>
                    <div class="state">
                        <p class="grey">客户状态</p>
                        <el-button type="info" size="mini" :style="{'background':'#f4f4f4','border-color':'#f4f4f4','color':'#7496F2','float':'left'}" round>{{history.historyDto.details[0].userResultStr}}</el-button>
                        <!-- <p class="black">{{history.custom_state}}</p> -->
                        <div class="grey" :style="{'margin-left':'45%'}" v-if="history.historyDto.details[0].nextContactTime"><p :style="{'float':'left'}">下次联系时间：</p><el-button type="info" size="mini" :style="{'background':'#f4f4f4','border-color':'#f4f4f4','color':'#7496F2','float':'left'}" round>{{history.historyDto.details[0].nextContactTime}}</el-button></div>
                    </div>
                </div>
                <div class="tag">
                    <el-button type="info" size="mini" v-for="item in history.summaryDto.taglist" :key="item" :style="{'background':'#7496F2','border-color':'#fff'}" round>{{item}}</el-button>
                </div>
                <div class="note">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                    <p :style="{'margin':'3px 7px','text-align':'left'}">{{history.historyDto.details[0].desc}}</p>
                </div>
            </div>
        </div>
        <DialogAdd v-bind:see="see" @reset="reset"></DialogAdd>
        <transition name="slide">
            <history id="history" v-if="show" :head='false' :details='history_detail' @close="history_close"></history>
        </transition>
        <div>
            <audio id="audioView" width="420px" height="320px" autoplay ></audio>
        </div>
    </div>
</template>
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
<style scoped>
    .call_active{
        background-color:#7496F2;
    }
    #auto_call{
        position: relative;
    }
    #auto_call>div{
        position: absolute;
        top:37px;
        right:13px;
        z-index: 2;
        background-color: #fff;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        padding: 10px 10px 0px;
        text-align:left;
    }
    .mask{
        position:absolute;
        left:0;
        top:0;
        width:100vw;
        height: 100vh;
        z-index:99;
        pointer-events: none;
    }
    #mask{
        position: fixed;;
        left:0;
        top:0;
        width:100vw;
        height: 100vh;
        background-color:rgba(255,255,255,0.5);
        z-index:99;
        pointer-events: all;
    }
    #mask>div{
        position:absolute;
        left:50%;
        top:50%;
        transform:translate3d(-50%,-50%,0);
    }
    #mask>div>p{
        font-size:16px;
        color: rgb(35,235,185);
    }
    #mask>div>span{
        text-decoration: underline;
        color:#7496F2;
    }
    .mask div{
        position:absolute;
        left:0;
        top:0;
        width:100vw;
        height: 60px;
        pointer-events: all;
    }
    .mask div{
        position:absolute;
        left:0;
        top:0;
        pointer-events: all;
    }
    .custom-tree-node{
        text-align: left;
    }
    .custom-tree-node p{
        
    }
    .custom-tree-node span{
        color: #999;
        font-size: 12px;
    }
    div{
        font-size: 13px;
    }
    .date_picker{
        position: relative;
    }
    .container{
        overflow: hidden;
        background: #F2F4F5;
        padding:10px;
    }
    .aside{
        float: left;
        width: 25%;
        height: -webkit-fill-available;
        position: relative;
        border: 1px solid #ccc;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
    }
    .staff{
        position: unset;
    }
    .aside .con{
        min-height: 60vh;
        box-sizing: border-box;
        padding: 0 6px;
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
        cursor: pointer;
    }
    .aside .foot{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin: 0;
        cursor: default;
        background:#fff;
        padding-bottom:20px;
    }
    .aside .foot li{
        width: 49%;
        float: left;
        margin: 8px 0;
        color: #7496F2;
    }
    .body{
        padding-left: 25.8%;
        box-sizing: border-box;
        
    }
    .body .head,.body .summary{
        overflow: hidden;
    }
    .body .summary{
        background-color: #fff;
        margin-right: 2%;
        padding: 16px;
    }
    .body .history{
        padding: 16px;
        background-color: #fff;
        margin-top: 12px;
        margin-right: 2%;
        text-align: left;
    }
    .mes3{
        overflow: hidden;
        text-align: left;
        float: left;
        width: 55%;
        margin: 0px 0.8% 10px;
        background-color: #fff;
        padding: 0 2%;
        box-sizing:border-box;
    }
    .mes2{
        overflow: hidden;
        text-align: left;
        height: 110px;
        float: left;
        width: 43%;
        margin: 0px 0 10px 0;
        background-color: #fff;
    }
    .mes2>p{
        padding:0 10px;
        margin: 12px 0;
    }
    .mes2>div.father>p{
        padding:0 10px;
    }
    .mes2>div.father>input{
        transform:translateX(10px);
    }
    #call{
        float: right;
        padding: 0 2%;
    }
    .call_state .call_icon{
        font-size: 23px;
        line-height:45px;
        float: left;
        margin:0;
    }
    #call_icon{
        margin:0 11px;
    }
    .call_icon{
        font-size: 23px;
        line-height:45px;
        float: left;
        margin: 31px 4px;
    }
    .call_state{
        overflow: hidden;
        color: #fff;
        min-width: 47px;
        background-color: rgba(0, 204, 102, 1);
        border-radius: 47px;
        text-align: center;
        display: inline-block;
        margin: 31px 10px;
        float: left;
    }
    .call_state span{
        line-height:45px;
        float: left;
    }
    .mes{
        overflow: hidden;
        padding: 10px 0;
        text-align: left;
        width: 50%;
        float: left;
    }
    .mes>div{
        margin:10px 0;
    }
    .father:hover input,.father:hover select{
        width: auto;
    }
    .father{
        display: inline;
    }
    .summary .tit{
        font-weight: 700;
        text-align: left;
    }
    body .tit{
        font-size:16px;
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
        font-size:14px;
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
    #history{
        position: fixed;
        right: 0;
        top: 0;
        background-color: #fff;
        box-shadow:-2px 0 5px #ccc;
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
import DialogAdd from "../component/dialog_add.vue"
import history from '../component/history_talk.vue'
import jquery from  '../js/jquery.js'
import sockjs from '../js/sockjs.js'
import stomp from '../js/stomp.js'
import jssip from '../js/jssip-3.0.27.js'
import workbench from '../js/workbench.js'
export default {
    name:'Staff_stage',
    data:function(){
        return {
            show:false,
            see:false,
            search:'',
            call_state:0,
            call_success:0,
            activeIndex:'1',
            worker_list:[{'key':'2','value':'发展成功'},{'key':'1','value':'持续跟进'},{'key':'3','value':'发展失败'}],
            TaskBySeat_data: [],
            DialPlanIntroWithPage_data:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            name:'',
            phone:'',
            sex:'',
            job:'',
            company:'',
            email:'',
            think:'',
            worker_state:2,
            time_next:'',
            tag_data: [],
            label_list:[],
            tag_list:[],
            note:'',
            history:{
                historyDto:{
                    effectiveContactNum:0,
                    totalContactNum:0,
                    details:[
                        {
                            answerType:0,callDuration:null,callEndTime:null,callReault:22,callReaultString:null,callSeesionId:null,callStartTime:"2018-05-03 11:03:55",contactType:10,id:null,loginName:null,number:null,partnerAccountId:null,seatAccountId:null,shortName:null,taskClientId:null,taskId:null,userResult:1,userResultStr:"继续跟进"
                        }
                    ]
                },
                summaryDto:{
                    tags:[],
                    taskClientId:"8bcd3b7d-3b74-4099-9abe-a421b9aaab27",
                    taskId:"da59b508-2443-42ca-af8d-33373d28b511",
                    taskName:"发大水发发嘎嘎水果蛋糕",
                    userResult:1,
                    taglist:[]
                }
            },
            contextmenu:{state:false,left:'',top:'',target:''},
            tags:[],
            history_detail:[],
            taskClientId:'',
            taskId:'',
            id:'',
            booklist:[{
                "areaName" : "string",
                "callResult" : 0,
                "classStr" : "string",
                "depName" : "string",
                "id" : "string",
                "nextContactTime" : "string",
                "nextContactTimeStr" : "string",
                "progress" : 0,
                "taskClientId" : "string",
                "taskId" : "string",
                "userName" : "string",
                "userNumber" : "string"
            }],
            task_state:0,
            planData:{},
            online_state:1,
            left:{taskClientId:null,
            taskListId:null,taskId:null},
            ua:null,
            from_name:null,
            timer:'00:00:00',
            n:0,
            stompClient:null,
            incomingSession:null,
            callIccSessionId:null,
            timestr:'',
            timestr2:'',
            active_data:null,
            call_set:false,
            call_during:5,
            call_remin:5,
            call_auto:'false',
            call_timer:null,
            time_error:null
        }
    },
    components:{
      DialogAdd,history
    },
    mounted() {
        window.onbeforeunload = function(){
            
            this.disconnect();
        };
        //缩小导航菜单
        this.$emit("close");
        this.TaskList_init({});
        this.$ajax.post(this.$preix+'/new/tag/findTagList')
        .then( (res) => {
            if(res.data.code==200){
                for(let i=0;i<res.data.info.length;i++){
                    res.data.info[i].tags=res.data.info[i].tagValue.split(';');
                }
                this.tag_data=res.data.info;
            }
        });
        this.call_init(this.hasGetUserMedia());
        this.connect();
    },
    beforeDestroy(){
        console.log(this.ua);
        if(this.ua != null){
            console.log("uaClose...");
            this.ua.stop();
        }
        this.disconnect();
        this.$emit("open");
    },
    methods:{
        test(){
            console.log(this.call_auto,typeof(this.call_auto));
            if(this.call_auto=='true'){
                console.log(123)
            }
        },
        uaInit:function (workbenchRst) {
            var _this=this;
            var fsDto = workbenchRst.fsDto;
            this.from_name = fsDto.name;
            var password = fsDto.password;
            var realm = fsDto.realm;
            var register = true;
            if(0 == fsDto.register){
                register = false;
            }
            var wsProt = fsDto.wsProt;
            var sessionTimers = fsDto.sessionTimers;
    
            var uri = "sip:"+this.from_name+"@"+realm;
            var freeswitchProtocol = workbenchRst.freeswitchProtocol;
            var wsURL = freeswitchProtocol+"://"+realm+":"+wsProt;
            var socket = new JsSIP.WebSocketInterface(wsURL);
            var configuration = {
                sockets: [socket],
                uri: uri,
                password: password,
                register: register,
                session_timers: sessionTimers,
                register_expires: 3600
            };
            this.ua = new JsSIP.UA(configuration);
            //JsSIP.debug.enable('JsSIP:*');JsSIP.debug.disable('JsSIP:*');
    
            //WebSocket连接事件
            this.ua.on('connected',function(data){
                console.log("onConnected- ",data);
                if(register){
                    _this.ua.unregister({
                        all: true
                    });
                    _this.ua.register();
                }
            });
            //WebSocket连接事件
            this.ua.on('disconnected',function(data){
                
                console.log("onDisconnected- ",data);
            });
            //注册事件
            this.ua.on('registered',function(data){
                console.log("onRegistered- ",data);
                _this.online_state=0;
            });
            //注册断开事件
            this.ua.on('unregistered',function(data){
                console.log("onUnregistered- ",data);
                _this.online_state=1;
            });
    
            /*新的传入或传出呼叫事件*/
            this.ua.on('newRTCSession', function (data) {
                console.log('incoming or outgoing call event :', data);
                if (data.originator == 'remote') {
                    setTimeout(function (){
                        _this.incomingSession = data.session;
                        var requestData = data.request.data;
                        requestData = requestData.substring(requestData.indexOf("icc_session_id"),requestData.length);
                        var iccSessionId = requestData.substr(requestData.indexOf(":")+2,36);
                        iccSessionId = $.trim(iccSessionId);
                        console.log("iccSessionId- ",iccSessionId);
                        console.log("callIccSessionId- ",_this.callIccSessionId);
                        if(_this.callIccSessionId == iccSessionId){//双呼
                            //$("#sessionId").val(callIccSessionId);
                            _this.sipAnswer(_this.incomingSession);
                        }
                    },2000);
                }
                data.session.on('newInfo',function(data){
                    console.log("onNewInfo -",data);
                });
                data.session.on('sending',function(data){
                    console.log("onSending -",data);
                });
                data.session.on('update',function(data){
                    console.log("onUpdate -",data);
                });
                data.session.on('connecting',function(data){
                    console.log("onConnecting -",data);
                });
                data.session.on('addstream',function(data){
                    console.log("onAddstream -",data);
                });
                data.session.on('accepted', function(data){
                    console.info('onAccepted - ', data);
                });
                data.session.on('confirmed', function(data){
                    console.info('onConfirmed - ', data);
                });
                data.session.on('sdp', function(data){
                    console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
                    data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
                    //console.info('onSDP, changed sdp - ', data.sdp);
                });
                data.session.on('progress', function(data){
                    console.info('onProgress - ', data);
                });
                //对等连接时设置远程流接收音频
                data.session.on('peerconnection', function(data){
                    console.info('onPeerconnection - ', data.peerconnection);
                    data.peerconnection.onaddstream = function(ev){
                        console.info('onaddstream from remote - ', ev);
                        $("#audioView").attr('src', URL.createObjectURL(ev.stream));
                    };
                });
                //通话结束
                data.session.on('ended',function(data){
                    console.info("onEnded-",data);
                    _this.sipTerminateEvent();
                });
                //通话连接失败
                data.session.on('failed',function(data){
                    console.info("onFailed-",data);
                    _this.call_state=0;
                    _this.stopTimer();
                });
            });
    
            this.ua.start();
        },
        //判断当前浏览器是否支持
        hasGetUserMedia:function() {
            return !(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        //接听
        sipAnswer:function (incomingSession) {
            incomingSession.answer({
                'mediaConstraints': {
                    'audio': true, 'video': false
                }
            });
            this.call_state=2;
            //$("#currentCallState").val(2);
        },
        call_init:function(hasGetUserMedia) {
            var _this=this;
            if(hasGetUserMedia){
                alert("当前浏览器不支持，请更换其他浏览器(推荐Google Chrome浏览器)");
                return;
            }
            this.$ajax.post(this.$preix+'/new/seatWorkbench/getWorkbenchRst')
            .then( (res) => {
                if(res.data.code != 200){
                    return;
                }else{
                    this.uaInit(res.data.info);

                }
            });
        
        },
        connect:function () {
            var _this=this;
            // websocket的连接地址，此值等于WebSocketMessageBrokerConfigurer中registry.addEndpoint("/icc/websocket").withSockJS()配置的地址
            var socket = new SockJS(this.$preix+'/ws/icc/websocket');
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, function(frame) {
                console.log('Connected: ' + frame);
                _this.stompClient.subscribe(
                    '/user/topic/ws',
                    function(respnose){
                        _this.showResponse(JSON.parse(respnose.body));
                    }
                );
            });
        },
        disconnect:function () {
            if (this.stompClient != null) {
                this.stompClient.disconnect();
                
            console.log('关闭websocket')
            }
            console.log("Disconnected");
        },
        showResponse:function (result) {
            if(result.channelType == 2 && result.directType == 3003){
                //$("#currentCallState").val(3);
                this.call_state=3;
                this.startTimer();
                console.log("客户已接起");
            }else if(result.directType == 3006){
                console.log("已挂断");
            }
        },
        //检查麦克风
        checkMicrophone:function (){
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(mediaStream){
                console.log("麦克风正常")
            }).catch(function(error) {
                console.log("麦克风未接入")
            });
        },
        //通话计时
        startTimer:function () {
            var _this=this;
            this.timer=setInterval(function () {
                _this.n++;
                var h = parseInt(_this.n/60/60);
                var m= parseInt(_this.n/60)%60;
                var s=_this.n%60;
                _this.timestr2=_this.toDub(m)+'分'+_this.toDub(s)+'秒';
                return _this.timestr=_this.toDub(h)+":"+_this.toDub(m)+":"+_this.toDub(s);
            },1000);
        },
        stopTimer:function () {
            clearInterval(this.timer);
            this.n=0;
        },
        //挂断事件
        sipTerminateEvent:function () {
            this.call_state=4;
            this.stopTimer();
        },
        //补零
        toDub:function (n){
            return n<10?"0"+n:""+n;
        },
        //挂断电话
        sipTerminate:function () {
            if(this.incomingSession == null || this.incomingSession.isEnded()){
                console.log("当前没有通话正在进行中");
                return;
            }
            this.incomingSession.terminate();
        },
        //静音和取消静音
        meteMicrophone:function () {
            if(this.incomingSession == null || this.incomingSession.isEnded()){
                console.log("当前没有通话正在进行中");
                return;
            }
            var muteObj = this.incomingSession.isMuted();
            if(muteObj.audio){
                this.incomingSession.unmute();
                console.log("已取消静音");
            }else{
                this.incomingSession.mute();
                console.log("已静音");
            }
        },
        //搜索任务名
        search_task(){
            if(this.task_state==0){
                let data={'nameOrNumber':this.search};
                this.TaskList_init(data);
            }else{
                let data={'nameOrNumber':this.search,'requireTotalCount':true};
                this.BookedList_init(data);
            }
            
        },
        //初始化呼叫列表
        TaskList_init(data){
            //初始化数据
            this.task_state=0;
            this.TaskBySeat_init(data);
            this.DialPlanIntroWithPage_init(data);
        },
        //初始化预约列表
        BookedList_init(data){
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryBookedTaskListBySeat',data)
            .then( (res) => {
                if(res.status==200){
                    this.task_state=1;
                    this.booklist=res.data.rows;
                }
            });
        },
        //获取客户详情
        detail_init(item,type){
            this.show=false;
            console.log(item);
            this.call_state=0;
            this.worker_state=2;
            this.callIccSessionId=null;
            if(item.children){
                return;
            }
            this.active_data=item;
            this.left.taskClientId=item.taskClientId;
            if(type==1){
                this.left.taskListId=null;
                this.left.taskId=item.taskId;
            }else{
                this.left.taskId=null;
                this.left.taskListId=item.id;
            }
            this.$ajax.post(this.$preix+'/new/seatWorkbench/getCallTaskClientDetail',{'taskClientId':item.taskClientId})
            .then( (res) => {
                if(res.data.code==200){
                    this.name=res.data.info.userName?res.data.info.userName:'';
                    this.phone=res.data.info.userNumber?res.data.info.userNumber:'';
                    this.sex=res.data.info.userGender;
                    this.job=res.data.info.userJob?res.data.info.userJob:'';
                    this.company=res.data.info.userCompany?res.data.info.userCompany:'';
                    this.email=res.data.info.userEmail?res.data.info.userEmail:'';
                    this.think=res.data.info.desc?res.data.info.desc:'';
                    this.note='';
                    this.taskClientId=item.taskClientId;
                    this.taskId=item.taskId;
                    this.id=item.id;
                }
            });
            this.$ajax.post(this.$preix+'/new/seatWorkbench/findSummaryAndHistoryDetail',{'taskClientId':item.taskClientId,'taskId':item.taskId})
            .then( (res) => {
                if(res.status==200){
                    if(res.data.summaryDto.tags[0]!=undefined){
                        res.data.summaryDto.taglist=res.data.summaryDto.tags[0].tagValue.split(';');
                    }
                    this.history=res.data;
                }
            });
        },
        //设置呼叫任务计划
        TaskBySeat_init(data){
            this.TaskBySeat_data=[];
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryTaskIntroBySeat',data
            ).then( res=>{
            if(res.data.code==200){
                    let _this=this;
                    for(let i=0;i<res.data.rows.length;i++){
                        let obj={};
                        let id=res.data.rows[i].taskId;
                        obj.label=res.data.rows[i].taskName;
                        var param = {};
                        param.taskId = res.data.rows[i].taskId;
                        data?param.nameOrNumber=data.nameOrNumber:'';
                        this.$ajax.post(this.$preix+'/new/seatWorkbench/queryProcClientWithTaskBySeat',param
                        ).then( res=>{
                            if(res.data.code==200){
                                
                                res.data.rows.map(item=>{item.label=item.userName;item.taskId=id});
                                //res.data.rows.map(item=>item.taskId=id);
                                obj.children=res.data.rows;
                            }
                            _this.TaskBySeat_data.push(obj);
                        });
                    }
                }
            })
        },
        //新增呼叫计划列表
        DialPlanIntroWithPage_init(data){
            this.DialPlanIntroWithPage_data=[];
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryDialPlanIntroWithPage',data
            ).then( res=>{
            if(res.data.code==200){
                    let _this=this;
                    for(let i=0;i<res.data.rows.length;i++){
                        let obj={};
                        obj.label=res.data.rows[i].name;
                        obj.dialplanId=res.data.rows[i].id;
                        var param = {};
                        param.dialplanId = res.data.rows[i].id;
                        data?param.nameOrNumber=data.nameOrNumber:'';
                        this.$ajax.post(this.$preix+'/new/seatWorkbench/queryTaskListByDialPlan',param
                        ).then( res=>{
                            if(res.data.code==200){
                                res.data.rows.map(item=>{
                                    item.label=item.userName;
                                    item.id=item.id
                                });
                                obj.children=res.data.rows;
                            }
                            _this.DialPlanIntroWithPage_data.push(obj);
                        });
                    }
                }
            })
        },
        worker_change:function(value){
            this.worker_state=value;
        },
        handleNodeClick(data) {
            this.label_list[data.group]=data.id;
            this.tag_list[data.group]=data.label;
        },
        //右键菜单
        prevent:function(e,data,note){
            this.planData=data;
            console.log(data);
            if(note==1&&data.children){
                return
            }
            e.preventDefault();
            this.contextmenu.state=true;
            this.contextmenu.left=e.clientX;
            this.contextmenu.top=e.clientY+document.documentElement.scrollTop;
            this.contextmenu.target=e.target;
            // if(e.target.getAttribute('class').indexOf('el-tree-node__content')!=-1){
            //     e.preventDefault();
            //     this.contextmenu.state=true;
            //     this.contextmenu.left=e.clientX;
            //     this.contextmenu.top=e.clientY+document.documentElement.scrollTop;
            //     this.contextmenu.target=e.target;
            // }else{
            //     this.contextmenu.state=false;
            // }
        },
        hide(){
            this.contextmenu.state=false;
            this.call_set=false;
        },
        //删除呼叫任务
        remove(){
            console.log(this.planData,this.planData.children);
            if(this.planData.children!=undefined){
                let Id=this.planData.taskClientId;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/deleteDialplan',{'id':Id}
                ).then( res=>{
                    if(res.data.code==200){
                        this.reload();
                    }
                })
            }else{
                let Id=this.planData.id;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/deleteTaskList',{'id':Id}
                ).then( res=>{
                    if(res.data.code==200){
                        this.reload();
                    }
                })
            }
        },
        //记录客户标签
        handleCommand(command) {
            this.tags[command.index]={'value':command.value};
        },
        //关闭弹窗
        reset:function(){
            this.see=false;
        },
        //设置历史记录信息
        enter(item){
            this.show=true;
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryResultHistoryEntity',{'taskId':item.taskId,'taskClientId':item.taskClientId}
            ).then( res=>{
                if(res.status==200){
                    this.history_detail=res.data.info.details;
                }
            });
        },
        //关闭历史记录
        history_close(){
            this.show=false;
        },
        //提交小结
        update(){
            if(this.callIccSessionId){
                let data={'desc':this.think,'nextContactTime':this.time_next,'taskId':this.taskId,'taskClientId':this.taskClientId,'userResult':this.worker_state,'taskListId':this.id,'sessionId':this.callIccSessionId}
                for(let i=0;i<this.tags.length;i++){
                    if(this.tags[i]!=null||this.tags[i]!=undefined){
                        var str='customTag'+(i+1);
                        data[str]=this.tags[i].value;
                    }
                }
                var _this=this;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/updateCallTag',data
                ).then( res=>{
                    if(res.data.code!=200){
                        alert(res.data.message);
                    }else{
                        console.log('提交小结',this.active_data);
                        _this.call_state=0;
                        this.TaskBySeat_data.map(items=>{
                            let i=items.children.indexOf(_this.active_data);
                            console.log(i);
                            if(i<(items.children.length-1)&&i!=-1){
                                _this.detail_init(items.children[i+1],1);
                                if(_this.call_auto=='true'){
                                    _this.call_state=5;
                                    _this.call_timer=setTimeout(function(){
                                        _this.call_state=0;
                                        _this.startCall();
                                    },_this.call_during*1000)
                                }
                            }
                        })
                        this.DialPlanIntroWithPage_data.map(items=>{
                            let i=items.children.indexOf(_this.active_data);
                            console.log(i);
                            if(i<items.children.length-1&&i!=-1){
                                _this.detail_init(items.children[i+1],2);
                                if(_this.call_auto=='true'){
                                    _this.call_state=5;
                                    _this.call_timer=setTimeout(function(){
                                        _this.call_state=0;
                                        _this.startCall();
                                    },_this.call_during*1000)
                                }
                            }
                        })
                    }
                });
            }
        },
        online_change(){
            if(this.online_state==0){
                this.online_state=0.5;
                this.ua.unregister({
                    all: true
                });
            }else{
                this.online_state=0.5;
                this.ua.register();
            }
        },
        startCall(){
            var _this=this;
            clearTimeout(this.time_error);
            //mask
            console.log(this.left);
            //开始拨号
            if(!this.ua.isRegistered()){
                alert("freeswitch连接异常！");
                return;
            }
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(mediaStream) {
                if(_this.call_state == 0){
                    console.log("正在呼叫。。。");
                    //_this.call_state=0.5;
                    _this.call_state=1;
                    var data={"taskClientId":_this.left.taskClientId,"taskListId":_this.left.taskListId,"from":_this.from_name,'taskId':_this.left.taskId};
                    for(let key in data){
                        if(data[key]==null){
                            delete data[key];
                        }
                    }
                    _this.$ajax.post(_this.$preix+'/new/seatWorkbench/seatDirectCall',data)
                    .then( (res) => {
                        console.log(res.data);
                        if(res.data.code == 200){
                            _this.callIccSessionId = res.data.info.sessionId;
                            _this.call_error=setTimeout(function(){
                                if(_this.call_state==1){
                                    alert('通话异常，已为你重置本次通话');
                                    _this.call_state=0;
                                }
                            },8000)
                        }else{
                            console.log("退回开始呼叫");
                            _this.call_state=0;
                        }
                    });
                }else{
                    console.log("在本次呼叫完成并提交联系小结前，请勿执行其他操作！");
                }
            }).catch(function(error) {
                console.log(error);
            });
        },
        //停止自动呼叫
        stopCall(){
            this.call_state=0;
            clearTimeout(this.call_timer);
            this.call_auto='false';
        },
        //修改基本信息
        upSeat(){
            var data={"desc" : this.think,"id" : this.left.taskClientId,"userCompany" : this.company,"userEmail" : this.email,"userGender" : this.sex,"userJob" : this.job,"userName" : this.name}
            this.$ajax.post(this.$preix+'/new/seatWorkbench/updateCallTaskClient',data).then(res=>{
                if(res.data.code==200){
                    console.log(res);
                }
            })
        }
    },
    inject:['reload']
}
</script>

