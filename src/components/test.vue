<template>
    <div class="container">
        <div id="first_init">
            <el-table :data="tableData" :style="{'width': '50%','margin':'20vh auto 12px'}" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="shortName" label="坐席昵称" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100">
                  <template slot-scope="scope">
                    <div class="father">
                      <p>{{scope.row.shortName}}</p>
                      <input type="text" v-model="scope.row.shortName">
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="loginName" label="坐席账号" class-name="line3" :show-overflow-tooltip=true min-width="120">
                  <template slot-scope="scope">
                    <div class="father">
                      <p>{{scope.row.loginName}}</p>
                      <input type="text" v-model="scope.row.loginName">
                    </div>
                  </template>
                </el-table-column>
                <el-table-column class-name="line11" label="是否激活坐席"  min-width="100">
                    <template slot-scope="scope">
                      <el-checkbox v-model="checked[scope.$index]" checked>激活坐席</el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column class-name="line11" label="是否重置密码"  min-width="100">
                    <template slot-scope="scope">
                      <el-checkbox v-model="checked[scope.$index]" checked>重置密码</el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div :style="{'text-align':'center'}">
              <el-button class="button" size="small">暂不设置</el-button>
              <el-button type="info" class="button" size="small">一键生效</el-button>
            
            </div>
        </div>
    </div>
</template>
<style scoped>
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }
</style>

<script>
export default {
    name:'test',
    data:function(){
        return {
            checked:[],
            tableData: [{
              'index':0,
              'shortName':'fwjqy001',
              'loginName':'张阿猫'
            },{
              'index':1,
              'shortName':'fwjqy001',
              'loginName':'张阿猫'
            }]
        }
    },
    methods:{
        // handlefp:function(){
        //     for (let key in data){
        //         if(data[key]==''){
        //             delete data[key];
        //         }
        //     }
        //     res.data.rows.splice(0,0,{'taskName':'全部','taskId':''});
        //     @sort-change="sort_change"
        //     sortable='custom'
        //     ,
        // sort_change({column, prop, order} ){
        //     console.log(column, prop, order);
        //     this.tag_init({});
        //window.reload();
        // }
        // },
        handlexx:function(){
            this.show = !this.show;
        }
    }
}
</script>
