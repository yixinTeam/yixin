<template>
    <div>
      <el-dialog title="分配客户" :visible.sync="assign" @close="close" center @open="open">
        <el-alert title="输入的分配数量已大于可分配的客户总量" center type="error" :show-icon="toast" class="toast" v-show="warn"></el-alert>
        <el-alert title="请输入分配数量" center type="error" :show-icon="toast" class="toast" v-show="warn2"></el-alert>
        <div :style="{'text-align':'left'}">未分配客户总量：{{totals}}人</div>
        <div class="tit">
            <p>坐席</p>
            <p>分配客户数量(人)</p>
        </div>
        <div class="con">
            <ul> 
                <li v-for="(item, index) in workerlist" :key="index" v-show="index<show_num">
                    <el-select v-model="workerlist[index]" placeholder="请选择坐席" size="mini">
                        <el-option  v-for="_item in worker" :key="_item.id" :label="_item.shortName" :value="_item.id" :disabled="workerlist.indexOf(_item.id)!=-1">
                        </el-option>
                    </el-select>
                </li>
            </ul>
            <ul> 
                <li v-for="(item, index) in workernum" :key="item.key" v-if="index<show_num" :style="{'margin':'4% 10% 4% 0'}">
                    <input type="text" v-model="workernum[index]" @input="check" placeholder="请输入分配客户数量" class="num" v-on:keyup="regnum">
                    <i class="el-icon-delete" @click="remove(index)"></i>
                </li>
            </ul>
            <div :style="{'float':'left','padding-left':'3%'}">
                <el-button type="text" size="mini" @click="add" v-show="worker.length>show_num"><i class="el-icon-plus"></i>新增一行</el-button>
            </div>
            <div :style="{'float':'right','padding-right':'3%'}">
                <el-button type="text" size="mini" @click="average">平均分配剩余客户</el-button>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="assign=false">&#12288;取消&#12288;</el-button>
            <el-button type="info" @click="save">完成分配</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<style scoped>
    .toast{
        position: absolute;
        top: -60px;
        left: 12.5%;
        width: 75%;
        opacity: 0.8;
    }
    .num{
        height: 28px;
        line-height: 28px;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: 14px;
        outline: 0;
        padding: 0 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
    }
    .num::-webkit-input-placeholder { /* WebKit browsers */
        color:    #ccc;
    }
    .num:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:    #ccc;
    }
    .num::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:    #ccc;
    }
    .num:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:    #ccc;
    }
    li{
        list-style: none;
        margin: 4% 0;
        position: relative;
    }
    .tit{
        overflow: hidden;
        box-sizing: border-box;
        padding: 3%;
        background-color: #f5f5f5;
        margin-top: 20px;
    }
    .tit>p{
        width: 50%;
        float: left;
        box-sizing: border-box;
        font-weight: 700;
        text-align: left;
        margin: 0;
    }
    .con{
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 40vh;
    }
    .con>ul{
        width: 50%;
        float: left;
        box-sizing: border-box;
        padding: 0 5% 0 0;
        margin-bottom: 0;
    }
    .con::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .con::-webkit-scrollbar
    {
        width: 3px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .con::-webkit-scrollbar-thumb
    {
        background-color: #8b8b8b;
        border-radius: 1px;
    }
    .el-icon-delete{
        position: absolute;
        top: 7px;
        right: -12%;
        cursor: pointer;
    }
</style>
<script>
export default {
    name:'dialog_assign',
    data:function(){
        return {
            workerlist:[],
            workernum:[],
            show_num:3,
            worker:[],
            toast:false,
            warn2:false
        }
    },
    props:['assign','total','taskId'],
    methods:{
        close:function(){
            for(var i=0;i<this.worker.length;i++){
            this.workerlist[i]='';
            this.workernum[i]='';
            }
            this.$emit("reset");
        },
        add:function(){
            if(this.show_num<this.worker.length){
                this.show_num++;
            }
        },
        remove:function(index){
            this.workernum.splice(index,1);
            this.workerlist.splice(index,1);
            this.workernum.push('');
            this.workerlist.push('');
            this.show_num--;
        },
        average:function(){
            var arr=[];
            for(let i=0;i<this.workerlist.length;i++){
                if(this.workerlist[i]!=''){
                    arr.push(i);
                }
            }
            var num=Math.floor(this.totals/arr.length);
            var remin=this.totals%arr.length;
            for(let j=0;j<arr.length;j++){
                if(j<remin){
                    var index=arr[j];
                    this.workernum.splice(index,1,num+1);
                }else{
                    var index=arr[j];
                    this.workernum.splice(index,1,num);
                }
            }
        },
        regnum:function(e){
            if(e.target.value.length==1){
                e.target.value=e.target.value.replace(/0/gi,"")
            }
            e.target.value=e.target.value.replace(/\D/gi,"");
            if(e.target.value>this.totals){
                this.toast=true;
            }else{
                this.toast=false;
            }
        },
        save(){
            var allocateInfos=[];
            this.workerlist.map((item,index)=>{
                if(item!=''&&this.workernum[index]!=''){
                    allocateInfos.push({'allocateNum':this.workernum[index],'seatAccountId':this.workerlist[index]})
                }
            })
            var data={'taskId':this.taskId,'allocateType':1,allocateInfos};
            this.$ajax.post(this.$preix+'/new/calltask/allocateCallTask',data)
            .then( (res) => {
                if(res.data.code==200){
                    //this.worker=res.data.rows;
                    this.assign=false;
                    this.reload();
                }
            })
        },
        open(){
            this.$ajax.post(this.$preix+'/new/account/findSeatList',{'state':1})
            .then( (res) => {
                if(res.data.code==200){
                    this.worker=res.data.rows;
                    this.show_num=this.worker.length;
                    for(var i=0;i<this.worker.length;i++){
                        this.workerlist[i]=this.worker[i].id;
                        this.workernum[i]='';
                    }
                }
            })
        },
        check(){
            console.log(1);
            var result=true;
            console.log(this.workernum)
            for(var i=0;i<this.workernum.length;i++){
                if(this.workernum[i]!=''){
                    result=false;
                }
            }
            this.warn2=result;
        }
    },
    inject:['reload'],
    computed:{
        totals:function(){
            return this.total;
        },
        warn:function(){
            var result=false;
            for(var i=0;i<this.workernum.length;i++){
                if(this.workernum[i]>this.total){
                    result=true;
                }
            }
            return result;
        }
    }
}
</script>
