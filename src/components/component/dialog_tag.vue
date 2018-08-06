<template>
    <div>
      <el-dialog title="新增客户标签" :visible.sync="see" @close="close" center @open="open">
        <el-form ref="form" :model="form" label-position="top" :rules="rules">
            <el-form-item label="标签名称"  class="tit" prop="tag_name">
                <el-input v-model="form.tag_name" placeholder="请填入标签名称" size="small"></el-input>
            </el-form-item>
            <el-form-item label="标签值"  class="tit" prop="tag_list">
                <div class="textarea" @click="input_focus">
                    <div v-if="!form.tag_list"></div>
                    <div v-for="(item,index) in form.tag_list" :key="index" tabindex="2" @keyup="deletes($event,index)" @click.stop="test">{{item}}</div>
                    <input type="text" id="tag"  @keyup="add($event)" v-model="form.tag_value" placeholder="请填写标签值，用回车分隔">
                </div>
            </el-form-item>
            <el-form-item label="默认值"  class="tit">
                <el-select v-model="form.tag_default" placeholder="请选择" size="small">
                    <el-option
                    v-for="(item,index) in form.tag_list"
                    :key="index"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="坐席填写小结时是否必选"  class="tit">
                <div>
                    <el-radio v-model="form.radio" label="0" size="mini">是</el-radio>
                    <el-radio v-model="form.radio" label="1" size="mini" checked>否</el-radio>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="see=false" size="small">&#12288;&#12288;取消&#12288;&#12288;</el-button>
            <el-button type="primary" @click="save_tag('form')" size="small">&#12288;保存&#12288;</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<style scoped>
    .textarea{
        width: 100%;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 4px;
        line-height: 20px;
    }
    .textarea div{
        display: inline-block;
        margin:4px 8px;
    }
    .textarea input{
        border:none;
        width: 100%;
        display: inline-block;
    }
    .tit input{
        font-size: 12px;
    }
    #tag{
        padding: 2px 10px;
        box-sizing: border-box;
    }
    input::-webkit-input-placeholder{
        color:#ccc;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#ccc;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#ccc;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
        color:#ccc;
    }
</style>
<script>
export default {
    name:'dialog_tag',
    data:function(){
        return {
           form:{
                tag_name:'',
                tag_value:'',
                tag_list:[],
                tag_default:'',
                id:'',
                radio:'1'
           },
           rules: {
                tag_name: [
                    { required: true, message: '请输入标签名', trigger: 'blur' },
                    { max: 10, message: '长度在 10 个字符以内', trigger: 'blur' }
                ],
                tag_list: [
                    { required: true, message: '请输入至少一个标签值', trigger: 'blur' }
                ]
            }
        }
    },
    props:['see','data'],
    methods:{
        close:function(){
            this.$emit("reset");
        },
        open(){
            if(this.data!=[]){
                this.form.tag_name=this.data.tagName;
                this.form.tag_list=this.data.tags;
                this.form.tag_default=this.data.tagDefaultValue;
                this.form.id=this.data.id;
            }else{
                this.form.tag_name='';
                this.form.tag_list=[];
                this.form.tag_default='';
                this.form.id='';
                this.form.tag_value='';
            }
        },
        input_focus:function(){
            document.getElementById('tag').focus();
        },
        add:function(e){
            if(this.form.tag_list==undefined){
                this.form.tag_list=[];
            }
            if(e.keyCode==13){
                this.form.tag_list.push(this.form.tag_value);
                this.form.tag_value='';
            }else if(this.form.tag_value.length>10){
                this.form.tag_value=this.form.tag_value.substring(0,10);
            }
        },
        deletes:function(e,index){
            if(e.keyCode==8){
                this.form.tag_list.splice(index,1);
            }
        },
        test:function(){

        },
        save_tag:function(formName){
            var _this=this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var data={'tagName':this.form.tag_name,'tagValue':this.form.tag_list.join(';'),'tagDefaultValue':this.form.tag_default,'id':this.form.id,'mandatory':this.form.radio}
                this.$ajax.post(this.$preix+'/new/tag/addOrUpdateTag',data)
                .then( (res) => {
                    if(res.data.code==200){
                        _this.see=false;
                        _this.$emit('update');
                        this.reload();
                    }
                });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    },
    inject:['reload']
}
</script>
