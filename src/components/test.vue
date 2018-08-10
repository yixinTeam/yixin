<template>
    <div class="container">
        <a-player autoplay :music="{
  url: 'http://10.240.80.72:10712/icc-static/2018/ring.mp3?sessionId=42375b65-e78f-4639-896a-796239866419&callSessionId=3f566e16-3c00-44b5-9ed9-8b43b1e316da'
}"></a-player>

    
    </div>
</template>
<style scoped>
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }
</style>

<script>
import VueAplayer from 'vue-aplayer'
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
            }],
            flag:false,

            musicList:'',

            songList:[],
            src:'http://10.240.80.72:10712/icc-static/2018/ring.mp3?sessionId=42375b65-e78f-4639-896a-796239866419&callSessionId=3f566e16-3c00-44b5-9ed9-8b43b1e316da'
        }
    },
    components: {


        'a-player': VueAplayer

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
    },
    mounted(){
        // let aplayer = this.$refs.player.control;

        // aplayer.play();
        var a=[1];
        var b=[2];
        b=b.concat(a);
        console.log(b);
    }
}
</script>
