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
          <el-badge :value="notify">
            <i class="el-icon-menu"></i>
          </el-badge>
        </div>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width='auto' :style="{'overflow':'hidden'}">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu :collapse="isCollapse"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#4B4D50"
              text-color="#fff"
              active-text-color="#ffd04b">
              <router-link :to="{path:'/staff/index'}">
                <el-menu-item index="1" class="el-submenu__title">
                  <i class="el-icon-index"></i>
                  <span slot="title">首页&#12288;&#12288;&#12288;&#12288;</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{path:'/staff/stage'}">
                <el-menu-item index="2" class="el-submenu__title">
                  <i class="el-icon-worker"></i>
                  <span slot="title">工作台&#12288;&#12288;&#12288;</span>
                </el-menu-item>
              </router-link>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-waihu"></i>
                  <span>外呼任务&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/staff/follow'}">
                    <el-menu-item class="item" index="2-1">外呼任务跟踪</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/staff/call_count'}">
                    <el-menu-item class="item" index="2-2">呼叫情况统计</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-shezhi"></i>
                  <span>设置&#12288;&#12288;&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/staff/worker'}">
                    <el-menu-item class="item" index="4-1">账号设置</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/staff/label'}">
                    <el-menu-item class="item" index="4-2">线路设置</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
          <i class="el-icon-d-arrow-right" @click="open"></i>
        </el-row>
      </el-aside>
      <el-main>
        <router-view class="content" @close="close" @open="open" v-if="alive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.item{
  padding: 0!important;
  width: 170px!important;
  min-width: 170px;
  text-align: center;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
.tac {
  max-width: 170px;
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
.title {
  line-height: 60px;
  font-size: 18px;
}
.notify {
	margin: 13.5px 0;
}
.hello {
	width: 100vw;
	min-width: 860px;
	overflow: auto;
	position: relative;
}
a {
	text-decoration: none;
}
.el-icon-d-arrow-right {
	position: absolute;
	left: 15px;
	bottom: 55px;
	color: #fff;
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
</style>

<script>
import md5 from '../js/md5.js'
import selec from '../component/select.vue';
export default {
	name: 'staff',
	data() {
		return {
      alive:true,
			notify: '3',
			isCollapse: false,
			identity:null,
		};
	},
	methods: {
		handleOpen(key, keyPath) {
			//console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			//console.log(key, keyPath);
		},
		close: function() {
			this.isCollapse = true;
		},
		open: function() {
			this.isCollapse = false;
    },
    reload(){
      this.alive=false;
      this.$nextTick(function(){
        this.alive=true;
      })
    },
    test(){
      location.href=this.$preix+'/logout'
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
	provide(){
    return {
      reload:this.reload
    }
  },
  mounted(){
    this.identity=this.getCookie('loginName');
    var data={
        'name':'qy1003','password':md5.md5('qy1003'),'password2':'123456'
    };
    this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate',
        data
    )
  }
};
</script>

