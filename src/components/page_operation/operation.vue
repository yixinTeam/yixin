<template>
  <el-container>
    <el-header>
      <el-row height="auto" class="header">
        <div class="nav title">猎客呼叫中心</div>
        <div class="title nav2 drop">
          <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{identity}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>{{identity}}</el-dropdown-item>
              <el-dropdown-item @click.native="test">
                  登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="notify nav2">
          <notify></notify>
        </div>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#4B4D50"
              text-color="#fff"
              active-text-color="#ffd04b">
              <router-link :to="{path:'/operation/index'}">
                <el-menu-item index="1">
                  <i class="el-icon-index"></i>
                  <span slot="title">首页&#12288;&#12288;&#12288;&#12288;</span>
                </el-menu-item>
              </router-link>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-waihu"></i>
                  <span>账号管理&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/operation/manager'}">
                    <el-menu-item index="2-1">管理员账号&#12288;</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/operation/staff'}">
                    <el-menu-item index="2-2">坐席账号&#12288;&#12288;</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-shezhi"></i>
                  <span>设置&#12288;&#12288;&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/manager/worker'}">
                    <el-menu-item index="3-1">个人信息&#12288;&#12288;</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view class="content" v-if="alive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.item{
  padding: 0!important;
  width: 170px!important;
  min-width: 170px;
}
.el-icon-index:before {
    content: '';
    width: 18px;
    height: 18px;
    display: block;
    background: url('../../../static/icon/index.png');
    background-size:18px 18px;
}
.el-icon-waihu:before {
    content: '';
    width: 18px;
    height: 18px;
    display: block;
    background: url('../../../static/icon/waihu.png');
    background-size:18px 18px;
}
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
.el-icon-shezhi:before {
    content: '';
    width: 18px;
    height: 18px;
    display: block;
    background: url('../../../static/icon/shezhi.png');
    background-size:18px 18px;
}
.el-icon-worker:before {
    content: '';
    width: 18px;
    height: 18px;
    display: block;
    background: url('../../../static/icon/worker.png');
    background-size:18px 18px;
}
.tac {
	width: 170px;
  height: 100vh;
  z-index: 2;
}
.header{
  overflow: hidden;
}
.header .nav{
  width: 170px;
  float: left;
  background-color: #7496F2;
  color:#fff;
  font-size: 20px;
  padding-bottom: 1px;
}
.header .drop{
  padding: 0 30px 0 18px;
}
.header .nav2{
  width: auto;
  float: right;
}
.title{
  line-height: 53px;
}
.notify{
  margin: 10px 0;
}
.hello{
  width: 100vw;
  min-width: 860px;
  overflow: auto;
  position: relative;
}
a{
  text-decoration: none;
}
.content{
  background-color: #F2F4F5;
}
</style>

<script>
import notify from '../component/notify.vue';
import jm from '../js/md5.js'
export default {
	name: 'operation',
	data() {
		return {
      alive:true,
      identity:null
		};
  },
  components:{notify},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
    },
    reload(){
      this.alive=false;
      this.$nextTick(function(){
        this.alive=true;
      })
    },
    getCookie(c_name){
        if (document.cookie.length > 0) {
            var arrCookie=document.cookie.split("; ");
            for(var i=0;i<arrCookie.length;i++){
                var arr=arrCookie[i].split("=");
                //找到名称为userId的cookie，并返回它的值
                if(c_name==arr[0]){
                    return arr[1];
                }
            }
        }
    }
  },
  mounted(){
    this.identity=this.getCookie('loginName');
    // var data={
    //   'name':'yw1','password':jm.md5('yw1'),'password2':'123456'
    // };
    // this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate',
    //   data
    // )
  },
	provide(){
    return {
      reload:this.reload
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
