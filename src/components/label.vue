<template>
    <div class="container">
        <div class="part2">
            <div class="part2_tit">
                <el-button type="info" class="button" :style="{float:'left'}" @click="add">新增用户标签</el-button>
                <el-button plain class="button" :style="{'float':'left'}">效果预览</el-button>
                <el-tooltip class="item" effect="dark" content="客户标签可以与外呼任务关联，让坐席在与客户沟通时快速标记用户，以便后续的客户分类与跟进。" placement="right">
                <el-button type="text" :style="{'float':'right','color':'#999'}" size="mini"><i class="el-icon-question"></i>什么是客户标签</el-button>
                </el-tooltip>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="p_name" label="属性名称" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_phone" label="可选值" class-name="line3" :show-overflow-tooltip=true min-width="300"> </el-table-column>
                <el-table-column prop="p_time" label="默认值" class-name="line4" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_state" label="创建时间" class-name="line5" sortable :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="140">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlexx(scope.$index, scope.row)">修改属性</el-button>&#12288;|
                        <el-button
                        size="mini" type="text"
                        @click="handlexx(scope.$index, scope.row)">删除属性</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <tag :see="add_tag" @reset="reset"></tag>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
    }
    .grey{
        color: #999;
        font-size: 12px;
    }
    .black{
        color: #444;
        font-size: 12px;
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
import tag from './component/dialog_tag.vue'
export default {
    name:'labels',
    data:function(){
        return {
            search:'',
            leading_date:[],
            add_tag:false,
            tableData: [{
                p_name: '是否重点跟进',
                p_phone: '重点跟进；非重点跟进；',
                p_time:'非重点跟进；',
                p_state:'2018/6/11 14:23',
                p_key:'0'
            },{
                p_name: '是否重点跟进',
                p_phone: '重点跟进；非重点跟进；',
                p_time:'非重点跟进；',
                p_state:'2018/6/11 14:23',
                p_key:'0'
            }]
        }
    },
    components:{tag},
    methods:{
        handlefp:function(){

        },
        handlexx:function(){
            this.show = !this.show;
        },
        add:function(){
            this.add_tag=true;
        },
        reset:function(){
            this.add_tag=false;
        }
    }
}
</script>
