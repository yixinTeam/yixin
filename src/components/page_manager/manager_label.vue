<template>
    <div class="container">
        <div class="part2">
            <div class="part2_tit">
                <el-button type="info" class="button" :style="{float:'left'}" @click="add">新增用户标签</el-button>
                <el-button plain class="button" :style="{'float':'left'}" @click="DialogVisible=true">效果预览</el-button>
                <el-tooltip class="item" effect="dark"  placement="right">
                    <div slot="content" :style="{'min-width':'200px'}">客户标签可以与外呼任务关联，让坐席在与客户沟通时快速标记用户，以便后续的客户分类与跟进。</div>
                    <el-button type="text" :style="{'float':'right','color':'#999'}" size="mini"><i class="el-icon-question"></i>什么是客户标签</el-button>
                </el-tooltip>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="tagName" label="属性名称" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column label="可选值" class-name="line3" :show-overflow-tooltip=true min-width="300">
                    <template slot-scope="scope">
                        {{scope.row.tags.join(';')}}
                    </template>
                </el-table-column>
                <el-table-column prop="tagDefaultValue" label="默认值" class-name="line4" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="create" label="创建时间" class-name="line5" sortable :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="130">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlech(scope.$index, scope.row)">修改属性</el-button>&#12288;|
                        <el-button
                        size="mini" type="text"
                        @click="handlede(scope.$index, scope.row)">删除属性</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <tag :see="add_tag" @reset="reset" @update="update" :data="chdata"></tag>
        <el-dialog title="标签预览" :visible.sync="DialogVisible" width="60%" center>
            <div class="summary">
                <p class="black tit">通话小结</p>
                <div>
                    <div class="state">
                        <p class="grey">跟进状态</p>
                        <p class="black see">发展成功</p>
                        <p class="black see">持续跟进</p>
                        <p class="black see">发展失败</p>
                    </div>
                </div>
                <div class="tag">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">客户标签</p>
                    <el-dropdown :hide-on-click="false" v-for="(item,index) in tableData" :key="index" :style="{'float':'left','line-height':'26px','margin': '0 6px'}">
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
                    placeholder="请输入内容">
                    </el-input>
                </div>
                <div class="submit">
                    <p class="grey">提交小结后将自动呼叫下一位客户</p>
                    <el-button type="info" size="mini" :style="{'background':'#7496F2','border-color':'#fff'}">提交小结</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style scoped>

    .summary{
        overflow: hidden;
        background-color: #fff;
        margin-right: 2%;
        padding: 16px;
    }
    .summary .tit{
        font-weight: 700;
        text-align: left;
    }
    .summary .state,.summary .tag{
        overflow: hidden;
        padding: 8px 0;
    }
    .state p {
        float: left;
        line-height: 28px;
        margin: 0px 4px;
    }
    .note{
        padding: 8px 0;
        overflow: hidden;
    }
    .submit{
        padding: 8px 0;
        text-align: right;
    }
    .submit p{
        display: inline-block;
    }
    .container{
        position: relative;
    }
    .part2_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .part2_tit .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
    }
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }
</style>

<script>
import tag from '../component/dialog_tag.vue'
export default {
    name:'labels',
    data:function(){
        return {
            search:'',
            leading_date:[],
            add_tag:false,
            tableData: [],
            chdata:[],
            DialogVisible:false
        }
    },
    components:{tag},
    methods:{
        handlech:function(index,row){
            this.chdata=row;
            this.add_tag=true;
        },
        handlede:function(index,row){
            console.log(row);
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/tag/delTag',{'id':row.id})
            .then( (res) => {
                if(res.data.code==200){
                    this.tag_init();
                }
            });
        },
        add:function(){
            this.add_tag=true;
        },
        tag_init:function(data){
            this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/tag/findTagList',data)
            .then( (res) => {
                if(res.data.code==200){
                    for(let i=0;i<res.data.info.length;i++){
                        res.data.info[i].tags=res.data.info[i].tagValue.split(';');
                    }
                    this.tableData=res.data.info;
                }
            });
        },
        reset:function(){
            this.chdata=[];
            this.add_tag=false;
        },
        update:function(){
            this.tag_init();
        }
    },
    mounted(){
        var data={
            'name':'wshqy','password':'123456','password2':'123456'
        };
        this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate',
            data
        );
        this.tag_init();
    }
}
</script>
