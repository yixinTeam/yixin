<template>
  <el-container>
    <el-header>
      <el-row height="auto" class="header">
        <el-col :span="6"><div class="grid-content bg-purple-dark title"><i class="el-icon-menu"></i>猎客呼叫中心</div></el-col>
        <el-col :span="14"><div class="grid-content bg-purple-dark">&nbsp; </div></el-col>
        <el-col :span="2" class="notify">
          <div class="grid-content bg-purple-dark">
            <el-badge :value="notify" class="item">
              <el-button size="small">通知</el-button>
            </el-badge>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple-dark title">
            <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{identity.default}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in identity.list" :key='item.key'>{{item.states}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside :width="width">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu :collapse="isCollapse"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <router-link :to="{path:'/staff/index'}">
                <el-menu-item index="1">
                  <i class="el-icon-index"></i>
                  <span slot="title">首页&#12288;&#12288;&#12288;&#12288;</span>
                </el-menu-item>
              </router-link>
              <router-link :to="{path:'/staff/stage'}">
                <el-menu-item index="2">
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
                    <el-menu-item index="2-1">外呼任务跟踪</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/staff/call_count'}">
                    <el-menu-item index="2-2">呼叫情况统计</el-menu-item>
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
                    <el-menu-item index="4-1">账号设置</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/staff/label'}">
                    <el-menu-item index="4-2">线路设置</el-menu-item>
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
	width: 200px;
	min-height: 400px;
}
.tac {
	position: relative;
	height: 100vh;
	position: absolute;
	z-index: 2;
	background: -webkit-repeating-linear-gradient(
		transparent,
		transparent 40px,
		rgba(84, 92, 100, 1) 40px,
		rgba(84, 92, 100, 1) 100%
	);
	background: -o-repeating-linear-gradient(
		transparent,
		transparent 40px,
		rgba(84, 92, 100, 1) 40px,
		rgba(84, 92, 100, 1) 100%
	);
	background: -moz-repeating-linear-gradient(
		transparent,
		transparent 40px,
		rgba(84, 92, 100, 1) 40px,
		rgba(84, 92, 100, 1) 100%
	);
	background: repeating-linear-gradient(
		transparent,
		transparent 40px,
		rgba(84, 92, 100, 1) 40px,
		rgba(84, 92, 100, 1) 100%
	);
}
.header {
	border-bottom: 1px solid rgba(84, 92, 100, 0.8);
}
.title {
	line-height: 53px;
}
.notify {
	margin: 10px 0;
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
import selec from '../component/select.vue';
export default {
	name: 'staff',
	data() {
		return {
      alive:true,
			width: '200px',
			notify: '3',
			isCollapse: false,
			identity: { list: [{ states: '坐席2333', key: '1' }, { states: '登出', key: '2' }], default: '坐席2333' },
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
			this.width = '65px';
		},
		open: function() {
			this.isCollapse = false;
			this.width = '200px';
    },
    reload(){
      this.alive=false;
      this.$nextTick(function(){
        this.alive=true;
      })
    }
	},
	provide(){
    return {
      reload:this.reload
    }
  }
};
</script>

