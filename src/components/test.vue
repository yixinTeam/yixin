<template>
    <div>
        <div v-for="(item,index) in Lists" :key="index">
<p>距离结束&nbsp;{{timeList2[index].h}}小时&nbsp;{{timeList2[index].m}}分&nbsp;{{timeList2[index].s}}秒</p>
    
        </div>
        </div>
</template>
    
<script>
export default {
  name:'test',
  data:function(){
      return {
          Lists:[],
          timeList:[],
          timeList2:[]
      }
  },
  mounted(){
      this.getMyList();   
  },
  methods:{
    getMyList(){
        var  that=this;
        this.Lists=[{
            orderTime:new Date().getTime()+10000
        },{
            orderTime:new Date().getTime()+100000
        },{
            orderTime:new Date().getTime()+1000000
        },{
            orderTime:new Date().getTime()+200000
        }]
        setInterval(function(){
            that.timeList2=[];
            for(let i in that.Lists){
                var orderTime = that.Lists[i].orderTime;
                that.timeList[i] = new Date(orderTime).getTime()>new Date().getTime()?Math.ceil((new Date(orderTime).getTime()-new Date().getTime())/1000):0;
                var h = Math.floor(that.timeList[i]/3600);
                var m = Math.floor(that.timeList[i]%3600/60);
                var s = Math.floor(that.timeList[i]%60);
                console.log(new Date(orderTime))
                that.timeList2.push({'h':h,'m':m,"s":s});
            }
        },1000)
    },
    tohub(n){
            return n>9?n:('0'+n);   
        },
  }
};
</script>