
var incomingSession = null;
var name = null;//坐席号码
var ua = 123;
var hasGetUserMedia
// var callTaskClientId = null;
// var hasWaitCallEnd = false;//是否存在待呼叫已结束电话
// var hasOrderCallEnd = false;//是否存在已预约已结束电话
export default{
    ua,
    name,
    callIccSessionId:null,
    //判断当前浏览器是否支持
    hasGetUserMedia:function() {
        return !(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },
    
    
      
    
    
    //检查freeswitch连接状态
    checkConnected:function () {
        if(ua.isRegistered()){
            console.log("通话线路连接正常");
        }else{
            console.log("通话线路连接异常");
        }
    },

    //检查呼叫间隔设置
    checkCallInterval:function () {
        var callInterval = $("#callInterval").val();
        var regPos = /^\d+$/;
        if(!regPos.test(callInterval)){
            bootbox.alert("请输入数字！");
            $("#callInterval").val(2);
            return;
        }
        if(callInterval < 2){
            $("#callInterval").val(2);
        }
        //var contextPath = [[${#httpServletRequest.getContextPath()}]];
        var url = contextPath+"/account/updateSeat";
        //var extSeatDto = [[${extSeatDto}]];
        loadJson(url,{"id":extSeatDto.id,"callInterval":callInterval},function (data) {
            if(data.code != 200){
                bootbox.alert(data.message);
            }
        });

    }
}
















var stompClient = null;








