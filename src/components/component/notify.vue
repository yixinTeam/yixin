<template>
    <el-dropdown trigger="click" class="id1" placement="top-end" @visible-change='visible' @command='handlecommand' :hide-on-click="false">
        <div>
            <el-badge :value="notify" :max="99" v-show="notify>0">
            <i class="el-icon-menu"></i>
            </el-badge>
            <i class="el-icon-menu"  v-show="notify==0"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command='item' v-for="item in notifylist" :key="item.mesId" v-html="item.content"></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<style scoped>
.el-icon-menu:before {
    content: '';
    width: 20px;
    height: 20px;
    margin: 0px 4px;
    display: block;
    background: url('../../../static/icon/menu.png');
    background-size: 20px 20px;
    transform: translateY(3px);
}
</style>

<script>
export default {
    name:'notify',
    data() {
		return {
            notifylist:[],
            notify:0
		};
    },
    methods:{
        visible(visible){
        if(visible){
            this.$ajax.post(this.$preix+'/new/notify/query-msg-intro',{"pageNum" : 1,"pageSize" : 20,"requireTotalCount" : true}).then(res=>{
                    if(res.data.code==200){
                        this.notifylist=res.data.rows;
                    }
                })
            }
        },
        handlecommand(command){
            console.log(command);
            this.$ajax.post(this.$preix+'/new/notify/mark-msg-readed').then(res=>{
                if(res.data.code==200){
                    console.log(1);
                    this.notify==0;
                }
            })
        },
    },
    mounted(){
        this.$ajax.post(this.$preix+'/new/notify/query-unread-msg-num').then(res=>{
            if(res.data.code==200){
                this.notify=res.data.info;
            }
        })
    }
}
</script>

