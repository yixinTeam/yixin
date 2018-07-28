<template>
    <div class="login-layout">
        <div class="m-login-nav">
            <nav class="nav u-cb">
                <a class="logo" href="javascript:void(0);"></a>
            </nav>
        </div>
        <div :style="{'background': 'url(https://10.240.80.72:8443/icc-interface/img/login.jpg) top no-repeat'}">
            <div>
                <div :style="{'height':'600px'}">
                    <div class="login-container">
                        <div class="position-relative">
                            <div id="login-box" class="login-box  widget-box no-border visible" v-show="state==1">
                                <div class="widget-body">
                                    <div class="widget-main" style="background-color: white;">
                                        <h4 class="header lighter bigger">
                                            <i class="ace-icon fa fa-coffee green"></i>
                                            欢迎登陆
                                        </h4>
                                        <div class="space-6"></div>
                                        <form action="loginValidate" id="login-form" novalidate="novalidate">
                                            <fieldset>
                                                <label class="block clearfix">
                                                            <span class="block input-icon input-icon-right">
                                                                <input class="form-control" id="name" name="name" placeholder="用户名">
                                                                <i class="ace-icon fa fa-user"></i>
                                                            </span>
                                                </label>
                                                <label class="block clearfix">
                                                            <span class="block input-icon input-icon-right">
                                                                <input class="form-control" id="password" placeholder="密码" type="password">
                                                                <input id="subPwd" name="password" style="display: none;">
                                                                <i class="ace-icon fa fa-lock"></i>
                                                            </span>
                                                </label>
                                                <label class="clearfix" id="login-verify-code" style="display:none;">
                                                    <input name="verifyCode" placeholder="验证码" style="width: 100px;" type="text">
                                                    <img alt="" src="" style="padding-bottom: 4px;">
                                                </label>

                                                <div class="red" id="tip"></div>
                                                <div class="space-4"></div>
                                                <div class="clearfix">
                                                    <label class="inline">
                                                        <input class="ace" id="rememberPWD" type="checkbox">
                                                        <span class="lbl grey"> 记住密码</span>
                                                    </label>
                                                    <label class="inline pull-right">
                                                        <span class="grey" @click="state=2">找回密码</span>
                                                    </label>
                                                </div>
                                                <div class="clearfix">
                                                    <button class="form-submit width-100 pull-right btn btn-sm btn-primary">
                                                        <strong class="bigger-110">登录</strong>
                                                    </button>
                                                </div>

                                                <div class="space-4"></div>
                                            </fieldset>
                                        </form>
                                    </div><!-- /.widget-main -->

                                    <!--<div class="toolbar clearfix">
                                        <div>
                                            <a href="#" data-target="#forgot-box" class="forgot-password-link">
                                                <i class="ace-icon fa fa-arrow-left"></i>
                                                忘记密码？
                                            </a>
                                        </div>

                                        <div>
                                            <a href="#" data-target="#signup-box" class="user-signup-link">
                                                需要注册？
                                                <i class="ace-icon fa fa-arrow-right"></i>
                                            </a>
                                        </div>
                                    </div>-->
                                </div><!-- /.widget-body -->
                            </div><!-- /.login-box -->

                            <div v-show="state==2" class="forgot-box widget-box no-border visible" id="forgot-box" :style="{'background-color': 'white'}">
                                <div class="widget-body">
                                    <div class="widget-main" style="background-color: white;padding-bottom:20px;">
                                        <h4 class="header lighter bigger">
                                            <i class="ace-icon fa fa-key green"></i>
                                            找回密码
                                        </h4>

                                        <div class="space-6"></div>
                                        <!--<p>
                                            Enter your email and to receive instructions
                                        </p>-->

                                        <form action="forgetStep1" id="retrieve-password-form" novalidate="novalidate">
                                            <fieldset>
                                                <label class="block clearfix">
                                                    <span class="block input-icon input-icon-right">
                                                        <input class="form-control" id="email" name="email" placeholder="请输入管理员注册邮箱号">
                                                        <i class="ace-icon fa fa-envelope"></i>
                                                    </span>
                                                </label>
                                                <label class="block clearfix" id="find-verify-code" style="margin-top: 10px;display:none;">
                                                    <input name="verifyCode" placeholder="验证码" style="width: 100px;" type="text">
                                                    <img alt="" src="" style="padding-bottom: 4px;">
                                                </label>
                                                <div class="red" id="find-error"> </div>
                                                <div class="green" id="find-info"> </div>
                                                <div class="space-6"></div>
                                                <div class="space-6"></div>
                                                <div class="clearfix">
                                                    <button class="width-100 pull-right btn btn-sm btn-primary">
                                                        <strong class="bigger-110">发送邮件</strong>
                                                    </button>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div><!-- /.widget-main -->

                                    <div :style="{'text-align':'left'}">
                                        <span class="grey">
                                            <i class="ace-icon fa fa-arrow-left grey"></i>
                                            前往登录
                                        </span>
                                    </div>
                                </div><!-- /.widget-body -->
                            </div><!-- /.forgot-box -->
                        </div><!-- /.position-relative -->
                    </div>

                </div><!-- /.row -->
            </div><!-- /.main-content -->
            <footer class="m-footer">浙江翼信科技有限公司©2013-2017  浙B2-20130234号</footer>
            <!--<div th:include="common/footer :: copy-section" th:remove="tag"></div>--><!--includer footer-->

        </div>
    </div>
    
</template>
<style scoped>
    .login-layout{
        background-color: white;
    }
    .m-login-nav {
        width: 100%;
        height: 120px;
        background: #fff;
    }
    .nav {
        margin: 0 auto;
        padding-left: 30px;
        list-style: none;
        width: 83%;
    }
    .u-cb {
        zoom: 1;
    }
    .logo {
        float: left;
        width: 224px;
        height: 70px;
        margin-top: 27px;
        background: url('https://10.240.80.72:8443/icc-interface/img/logo.png') top no-repeat;
    }
    .login-container{
        width: 375px;
        margin: 0px auto 0px;
        padding-top: 100px;
    }
    .pos-rel, .position-relative {
        position: relative;
    }
    .login_box{
        background-color: white;
    }
    .login-layout .widget-box.visible {
        visibility: visible;
        position: relative;
        z-index: auto;
        -moz-transform: scale(1,1) translate(0);
        -webkit-transform: scale(1,1) translate(0);
        -o-transform: scale(1,1) translate(0);
        -ms-transform: scale(1,1) translate(0);
        transform: scale(1,1) translate(0);
        transition: transform .3s ease;
        -moz-transition: -moz-transform .3s ease;
        -webkit-transition: -webkit-transform .3s ease;
        -o-transition: -o-transform .2s ease;
    }
    .login-layout .widget-box {
        visibility: hidden;
        position: fixed;
        z-index: -5;
        border-bottom: none;
        box-shadow: none;
        padding: 6px;
        background-color: #394557;
        -moz-transform: scale(0,1) translate(-150px);
        -webkit-transform: scale(0,1) translate(-150px);
        -o-transform: scale(0,1) translate(-150px);
        -ms-transform: scale(0,1) translate(-150px);
        transform: scale(0,1) translate(-150px);
    }
    .widget-box.no-border {
        border-width: 0;
    }
    .widget-box {
        padding: 0;
        box-shadow: none;
        margin: 3px 0;
        border: 1px solid #CCC;
    }
    .progress, .widget-box {
        -webkit-box-shadow: none;
    }
    .no-border {
        border-width: 0;
    }
    .login-layout .login-box .widget-main {
        padding-bottom: 16px;
    }
    .login-layout .widget-box .widget-main {
        padding: 16px 36px 36px;
        background: #fff;
    }
    h4.bigger {
        font-size: 19px;
    }
    .header {
        line-height: 28px;
        margin-bottom: 16px;
        margin-top: 18px;
        padding-bottom: 4px;
        border-bottom: 1px solid #CCC;
    }
    .lighter {
        font-weight: lighter;
    }
    .header>.ace-icon {
        margin-right: 2px;
    }
    .green {
        color: #69AA46!important;
    }
    .ace-icon {
        text-align: center;
    }
    .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .space-6, [class*=vspace-6] {
        max-height: 1px;
        min-height: 1px;
        overflow: hidden;
        margin: 6px 0 5px;
    }
    fieldset {
        margin: 0;
        min-width: 0;
    }
    fieldset, legend {
        padding: 0;
        border: 0;
    }
    .login-layout label, .ui-jqdialog-content .searchFilter .queryresult {
        margin-bottom: 11px;
    }
    .block {
        display: block!important;
    }
    label {
        font-weight: 400;
        font-size: 14px;
    }
    label {
        max-width: 100%;
    }
    span.input-icon {
        display: inline-block;
    }
    .input-icon {
        position: relative;
    }
    .input-icon.input-icon-right>input {
        padding-left: 6px;
        padding-right: 24px;
        box-sizing: border-box;
    }
    .form-control, select {
        border-radius: 0;
        -webkit-box-shadow: none!important;
        box-shadow: none!important;
        color: #858585;
        background-color: #FFF;
        border: 1px solid #D5D5D5;
    }
    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 12px;
    }
    .form-control, output {
        font-size: 14px;
        line-height: 1.42857143;
        display: block;
    }
    .input-icon.input-icon-right>.ace-icon {
        left: auto;
        right: 3px;
    }
    .input-icon>.ace-icon {
        padding: 0 3px;
        z-index: 2;
        position: absolute;
        top: 1px;
        bottom: 1px;
        left: 3px;
        line-height: 30px;
        display: inline-block;
        color: #909090;
        font-size: 16px;
    }
    .ace-icon {
        text-align: center;
    }
    .space-4 {
        max-height: 1px;
        min-height: 1px;
        overflow: hidden;
        margin: 4px 0 3px;
    }
    .pull-right {
        float: right!important;
    }
    .btn-primary, .btn-primary.focus, .btn-primary:focus {
        background-color: #428BCA!important;
        border-color: #428BCA;
    }
    .btn-sm {
        border-width: 4px;
        font-size: 13px;
        padding: 4px 9px;
        line-height: 1.38;
    }
    .btn {
        color: #FFF!important;
        text-shadow: 0 -1px 0 rgba(0,0,0,.25);
        background-image: none!important;
        border: 5px solid #FFF;
        border-radius: 0;
        box-shadow: none!important;
        -webkit-transition: background-color .15s,border-color .15s,opacity .15s;
        -o-transition: background-color .15s,border-color .15s,opacity .15s;
        transition: background-color .15s,border-color .15s,opacity .15s;
        vertical-align: middle;
        margin: 0;
        position: relative;
    }
    .width-100{
        width: 100%!important;
        padding: 8px 0;
    }
    label input[type=checkbox].ace, label input[type=radio].ace {
        z-index: -100!important;
        width: 1px!important;
        height: 1px!important;
        clip: rect(1px,1px,1px,1px);
        position: absolute;
    }
    input[type=checkbox].ace, input[type=radio].ace {
        opacity: 0;
        position: absolute;
        z-index: 1;
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
    input[type=checkbox].ace+.lbl::before, input[type=radio].ace+.lbl::before {
        cursor: pointer;
        font-family: fontAwesome;
        font-weight: 400;
        font-size: 12px;
        color: #FFF;
        content: "\a0";
        background-color: #FAFAFA;
        border: 1px solid #C8C8C8;
        box-shadow: 0 1px 2px rgba(0,0,0,.05);
        border-radius: 0;
        display: inline-block;
        text-align: center;
        height: 14px;
        line-height: 12px;
        min-width: 14px;
        margin-right: 1px;
        position: relative;
        top: -1px;
    }
    .clearfix{
        text-align: left;
    }
    h4{
        text-align: left;
    }
</style>
<script>
export default {
    name:'login',
    data:function(){
        return {
            state:1
        }
    }
}
</script>
