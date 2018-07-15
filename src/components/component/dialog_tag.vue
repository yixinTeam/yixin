<template>
    <div>
      <el-dialog title="新增客户标签" :visible.sync="see" @close="close" center>
        <div class="tit">
            <p>属性名称</p>
            <el-input v-model="tag_name" placeholder="请输入内容" size="small"></el-input>
        </div>
        <div class="tit">
            <p>属性值</p>
            <div class="textarea" @click="input_focus">
                <div v-for="(item,index) in tag_list" :key="index" tabindex="2" @keyup="deletes($event,index)" @click.stop="test">{{item}}</div>
                <input type="text" id="tag"  @keyup="add($event)" v-model="tag_value">
            </div>
        </div>
        <div class="tit">
            <p>默认值</p>
            <el-select v-model="tag_default" placeholder="请选择" size="small">
                <el-option
                v-for="(item,index) in tag_list"
                :key="index"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="see=false" size="small">&#12288;取消&#12288;</el-button>
            <el-button type="info" @click="see=false" size="small">&#12288;保存&#12288;</el-button>
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
</style>
<script>
export default {
    name:'dialog_tag',
    data:function(){
        return {
           tag_name:'',
           tag_value:'',
           tag_list:[],
           tag_default:''
        }
    },
    props:['see'],
    methods:{
        close:function(){
            this.$emit("reset");
        },
        input_focus:function(){
            document.getElementById('tag').focus();
        },
        add:function(e){
            if(e.keyCode==13){
                this.tag_list.push(this.tag_value);
                this.tag_value='';
            }
        },
        deletes:function(e,index){
            if(e.keyCode==8){
                this.tag_list.splice(index,1);
            }
        },
        test:function(){

        }
    }
}
</script>
