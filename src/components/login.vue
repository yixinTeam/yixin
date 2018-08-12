<template>
    <div class="loginWrap">
        <div class="loginTop">
              <!-- 这里是头部log和name -->
              <img src="../assets/images/log.jpg" alt="" class="logImg">
        </div>
        <div class="logincontent">
            <!-- 这里是中间登陆背景图和登陆框 -->
            <img src="../assets/images/bg.png" alt="" class="loginBg">
            <div class="loginBox">
                <div v-if="loginShow" class="loginWrapper">
                    <div class="bigger">
                        <i class="el-icon-service iconLoing"></i>
                        欢迎登陆
                    </div>
                    <form @submit.prevent="loginSubmit">
                        <!-- 用户名 -->
                        <div class="loginForm">
                           <el-input placeholder="用户名" suffix-icon="el-icon-edit" v-model="formName.userName"></el-input>  
                        </div>
                        <!-- 密码 -->
                        <div class="loginForm">
                           <el-input type="password" placeholder="密码" suffix-icon="el-icon-view" v-model="formName.userPassWord"></el-input>  
                        </div>
                        <div class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="验证码" v-model="formName.flag"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img :src="varify_img" alt="" class="verifyImg" @click="varify_img_change">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                        </div>
                        <div class="loginForms">
                            <el-checkbox v-model="formName.checked">记住密码</el-checkbox>
                            <span class="pass" @click="retrievePassword()">找回密码</span>
                        </div>
                        <!-- 登陆按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginBtn }}</button>
                        </div>
                    </form>
                </div>
                <div v-if="passWord" class="forgetPassword">
                    <div class="bigger">
                        <i class="el-icon-service iconLoing"></i>
                        找回密码
                    </div>
                    <form @submit.prevent="loginEmials">
                        <!-- 邮箱 -->
                        <div class="loginForm">
                           <el-input placeholder="请输入管理员注册邮箱号" suffix-icon="el-icon-view" v-model="formNames.emial"></el-input>  
                        </div>
                        <div class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="验证码" v-model="formNames.flags"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img src="" alt="" class="verifyImg">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                        </div>
                        <!-- 发送邮件按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginEmial }}</button>
                        </div>
                    </form>
                    <div class="goLogin" @click="goLogin">
                        <i class="el-icon-back"></i><span>前往登陆</span>
                    </div>
                </div>
                <div v-if="resetPass" class="resetPassword">
                    <div class="bigger">
                        <i class="el-icon-service iconLoing"></i>
                        重置密码
                    </div>
                    <form @submit.prevent="resetPassWord">
                        <div v-if="zhuceEmial==''" class="verifyTexts">
                           <!-- 此处为验证提示信息 -->
                        </div>
                        <div class="emialInfo">
                            <span>注册邮箱：</span><span>{{zhuceEmial}}</span>
                        </div>
                        <!-- 新密码 -->
                        <div class="loginForm">
                           <el-input placeholder="请输入内容" suffix-icon="el-icon-view" v-model="formPass.newPassWord"></el-input>  
                        </div>
                        <!-- 二次确认密码 -->
                        <div class="loginForm">
                           <el-input placeholder="请输入内容" suffix-icon="el-icon-view" v-model="formPass.PassWord"></el-input>  
                        </div>
                        <div class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="请输入内容" v-model="formName.flag"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img src="" alt="" class="verifyImg">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                        </div>
                        <!-- 确定按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginRight }}</button>
                        </div>
                    </form>
                    <div class="goLogin" @click="goLogins">
                        <i class="el-icon-back"></i><span>前往登陆</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="loginBottom">
            <!-- 这里是系统尾注 -->
            <span>浙江翼信科技有限公司©2013-2017  浙B2-20130234号</span>
        </div>
    </div>
</template>

<script>
import jm from './js/md5.js'
import { isRegisterUserName,isPasswd } from "./js/validate.js";   // 验证函数
export default {
    name:'login',
    data(){
        return {
            state:1,
            loginShow:true,
            passWord:false,
            resetPass:false,
            formName: {//表单中的参数
                userName:'',
                userPassWord:'',
                checked: '',
                flag: ''
            },
            formNames: {//表单中的参数
                email:'',
                flags: ''
            },
            formPass: {//表单中的参数
                newPassWord:'',
                PassWord: ''
            },
            loginBtn:'登 录',
            loginEmial:'发送邮件',
            loginRight:'确定',
            zhuceEmial:'zhuweiwen@yixin.im',
            varify_img:null
        }
    },
    methods: {
        //登陆
        loginSubmit(){
            var self = this;
            if(this.formName.checked){
                this.setCookie(self.formName.userName,self.formName.userPassWord,7);
            }
            
            // if(!isRegisterUserName(self.formName.userName)) {
            //     //self.msgErrorShow("请输入正确账号");
            //     console.log(1);
			// 	return false;
            // }
            // if(!isPasswd(self.formName.userPassWord)) {
            //     //self.msgErrorShow("请输入正确密码");
			// 	return false;
            // }
            if(self.formName.flag.length!=4) {
                //self.msgErrorShow("请输入正确验证码");
				return false;
            }
            self.loginBtn = "登录中...";
            let parameter = {
                // "email" : "string",
                "name" : this.formName.userName,
                "password" : jm.md5(this.formName.userPassWord),
                // "password2" : "string",
                // "reqId" : "string",
                // "token" : "string",
                // "verifyCode" : "string"
            }
            this.$ajax.post(this.$preix+'/new/loginValidate',parameter)
            .then( (res) => {
                if(res.data.code==200){
                    if(res.data.rows[0].type==1){
                        this.$router.push({ path: '/operation/index',query:{userId:self.formName.userName}})
                    }else if(res.data.rows[0].type==2){
                        this.$router.push({ path: '/manager/index',query:{userId:self.formName.userName}})
                    }else if(res.data.rows[0].type==3){
                        this.$router.push({ path: '/staff/index',query:{userId:self.formName.userName}})
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: 'warning'
                    });
                }
            })
        },
        varify_img_change(){
            this.varify_img=this.$preix+'/new/verifyCode?ts='+new Date().getTime();
        },
        setCookie(c_value, p_value, expiredays){
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie="loginName=" + encodeURIComponent(c_value)+"; expires="+exdate.toGMTString();
            document.cookie="password=" + encodeURIComponent(p_value)+"; expires="+exdate.toGMTString();;
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
        },
        //点击找回密码打开找回密码显示框
        retrievePassword(){
            // alert("11")
            this.loginShow = false;
            this.passWord = true;
        },
        //发送邮件
        loginEmials(){
            
        },
        //重置密码确定按钮
        resetPassWord(){

        },
        // 从找回密码前往登陆
        goLogin(){
            this.passWord = false;
            this.loginShow = true;
        },
        //从重置密码前往登陆
        goLogins(){
            this.resetPass = false;
            this.loginShow = true;
        }
    },
    mounted(){
        this.varify_img_change();
        this.formName.userName=this.getCookie('loginName');
        if(this.loginShow){
            this.formName.userPassWord=this.getCookie('password');
        }
    }
}
</script>

<style scoped>
/* login头部样式 */
.loginTop{
    height: 120px;
    background: white;
    position: relative;
}
.logImg{
    height: 60px;
    position: absolute;
    top: 35px;
    left: 300px;
}
/* login背景样式 */
.loginBg{
    width: 100%;
    height: 100%;
}
/* login中间内容样式 */
.logincontent{
    height: 550px;
    position: relative;
}
/* 表单验证提示信息样式 */
.verifyText,.verifyTexts{
    font-size: 12px;
    color: red;
}
/* login登陆框样式 */
.loginBox{
   width: 375px;
   background: white;
   box-sizing: border-box;
   position: absolute;
   top: 80px;
   right: 150px;
}
/* login登陆状态样式 */
.loginWrapper{
   box-sizing: border-box;
   padding: 40px;
}
/* login icon样式 */
.iconLoing{
    color: green;
}
/* login 欢迎语样式 */
.bigger{
    border: 0;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    text-align: left;
    font-size: 18px;
    margin-bottom: 20px;
}
.pass{
    cursor: pointer;
}
/* login输入框样式 */
.loginForm,.loginForms{
   margin-bottom: 10px; 
   height: 40px;
   display: flex;
   align-items: center;
}
.loginForms{
    justify-content: space-between;
}
/* login 验证输入框样式 */
.verify{
    width: 40%;
    margin-right: 20px;
}
/* login 验证码图片样式 */
.verifyImg{
    border:1px solid red;
    width: 30%;
    height: 80%;
}
/* 登陆和发送邮件按钮样式 */
.btnLoginSubmit{
   border: 0;
   width: 100%; 
   height:40px;
   font-size: 16px; 
   color: #fff; 
   cursor: pointer;
   background:#84abf8;
   background:-webkit-linear-gradient(left, #84abf8, #84abf8);
   background:-o-linear-gradient(left, #84abf8, #84abf8);
   background:linear-gradient(to right, #84abf8, #84abf8);
   /* -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#84abf8', endColorstr='#84abf8')"; */
}
/* 找回密码框样式 */
.forgetPassword{
   box-sizing: border-box;
   padding: 40px;
}
/* 前往登陆按钮样式 */
.goLogin{
   text-align: left;
   line-height: 30px;
   margin-top: 20px;
   cursor: pointer;
}
/* 重置密码框样式 */
.resetPassword{
   box-sizing: border-box;
   padding: 40px;
}
/* 获取到的邮箱信息样式 */
.emialInfo{
   text-align: left;
   line-height: 30px;
   font-size: 14px;
}
/* login 底部尾注样式 */
.loginBottom{
    height: 60px;
    background: white;
    font-size: 12px;
    line-height: 60px;
}
</style>
