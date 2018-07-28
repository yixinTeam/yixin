<template>
    <div>
      <el-dialog title="导入客户" :visible.sync="leading" @close="close">
        <el-steps :active="dialog_active" align-center>
          <el-step title="上传客户资源"></el-step>
          <el-step title="确认导入数据"></el-step>
          <el-step title="编辑导入任务"></el-step>
        </el-steps>
        <div v-show="dialog_active==0">
          <div class="upfiles">
            <input type="file" @input="upfiles" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            <div>
              <p>上传客户资源模板</p>
            </div>
          </div>
          <div class="note">
            请先下载客户资源模板，按照格式填写数据并上传。<br>
            请注意：<br>
            • 不要修改模板格式，以免数据读取失败；<br>
            • 同一呼叫任务内手机号相同的客户信息将会被覆盖；<br>
            • 单次导入数据不要超过1000条；
          </div>
        </div>
        <div  v-show="dialog_active==1&&leading_complete==0">
          <div v-loading="loading"></div>
          <el-button type="info"  class="dialog_next" :disabled="leading_state">继续</el-button>
        </div>
        <div  v-show="dialog_active==1&&leading_complete==1">
          <div class="data_num">{{data_complete}}</div>
          <el-button type="info"  class="dialog_next" @click="dialog_active = 2">继续</el-button>
        </div>
        <div  v-show="dialog_active==2&&mission_edit==0">
          <div class="mission" :style="{margin:'5% 0'}">
            <p>任务名称</p>
            <el-select v-model="mission_value" placeholder="请选择" size="mini" :filterable='true' :allow-create='true' :default-first-option='true'>
              <el-option v-for="item in mission_list" :key="item.taskId" :label="item.taskName" :value="item.taskName">
              </el-option>
            </el-select>
          </div>
          <br>
          <div class="mission" :style="{margin:'0 0 10%'}">
            <p>关联客户标签</p>
            <el-checkbox-group v-model="tag" size="mini" name="mission_tag" @change="change">
              <el-checkbox :label="item.tagName" border v-for="item in taglist" :key="item.id" :style="{'margin':'6px 4px'}"></el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button type="info"  class="dialog_next" @click="mission_confirm" :disabled="mission_value==''">确认信息</el-button>
        </div>
        <div  v-show="dialog_active==3">
          <div class="data_num"><i class="el-icon-success"></i>{{result[0]}}<br>{{result[1]}}</div>
          <el-button type="info"  class="dialog_next" @click="leading=false">完成</el-button>
        </div>
      </el-dialog>
    </div>

</template>
<style scoped>
    .upfiles{
      position: relative;
      border-bottom: 1px solid #e4e4e4;
    }
    .upfiles>input{
      opacity: 0;
      width: 116px;
      height: 34px;
      position: absolute;
      transform: translateX(-50%);
      z-index: 2;
    }
    .upfiles>div{
      width: 100%;
      position: relative;
    }
    .upfiles>div>p{
      padding: 10px 8px;
      background-color: rgb(153,153,153);
      color: #fff;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      width: 116px;
      margin: 50px auto;
    }
    .note{
      text-align: left;
      font-size: 12px;
      box-sizing: border-box;
      display: inline-block;
      margin-top:15px;
      line-height: 20px;
    }
    .loading{
      height: 100px;
    }
    .dialog_next{
      padding: 2% 15%;
    }
    .data_num{
      font-size: 16px;
      margin:10% auto;
      text-align: left;
       width: fit-content;
    }
    .mission{
      overflow: hidden;
    }
    .mission>p{
      float: left;
      width: 25%;
      text-align: right;
      margin: 0;
    }
    .el-icon-success{
      font-size: 26px;
      float: left;
      line-height: 41px;
    }
</style>
<script>
    export default {
        name: "Dialog",
        data:function () {
            return {
              dialog_active:0,
              loading:true,
              leading_complete:0,
              leading_state:false,
              mission_edit:0,
              data_complete:'',
              mission_value:"",
              mission_list:[],
              taglist:[],
              tag:[],
              tagids:[],
              result:[]
            }
        },
        props:["leading"],
        methods:{
          //上传模板
            upfiles:function (e) {
              this.dialog_active=1;
              let formdata = new FormData();
              formdata.append('file',event.target.files[0]);
              this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/calltask/importCallTaskClientsCheck',formdata,{headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
              .then( (res) => {
                  if(res.data.code==200){
                    this.data_complete=res.data.message;
                    this.leading_complete=1;
                  }
              });
            },
            //确认信息
            mission_confirm:function () {
              this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/calltask/insertCallTask',{"taskTag":{"tagIds":this.tagids,"taskName":this.mission_value}})
              .then( (res) => {
                  if(res.data.code==200){
                    this.result=res.data.info.split('</br>');
                    console.log(res.data.info,this.result)
                    this.dialog_active=3;
                  }
              });
            },
            //关闭弹窗
            close:function(){
              this.$emit('reset');
              this.dialog_active=0;
              this.leading_complete=0;
              this.mission_edit=0;
            },
            change(item){
              var arr=[];
              for(let i=0;i<this.tag.length;i++){
                var str=this.tag[i];
                for(let j=0;j<this.taglist.length;j++){
                  if(str==this.taglist[j].tagName){
                    arr.push(this.taglist[j].id);
                  }
                }
              }
              this.tagids=arr;
            }
        },
        mounted(){
          //任务列表数据
          this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/calltask/queryRightCallTaskList')
          .then( (res) => {
              if(res.data.code==200){
                  this.mission_list=res.data.rows;
              }
          });
          //标签数据
          this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/tag/findTagList')
          .then( (res) => {
              if(res.data.code==200){
                  this.taglist=res.data.rows;
              }
          });
        }
    }
</script>


