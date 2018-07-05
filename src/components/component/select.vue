<template>
  <el-select placeholder="请选择" v-model="value" popper-class="sel">
    <el-option
      v-for="item in list"
      :key="item.key"
      :value="item.states">
      <span style="float: left">{{ item.states  }}</span>
    </el-option>
  </el-select>
</template>


<script>
export default {
    name:'selec',
    data:function(){
        return {
            list:this.lists,
            value: this.pretermit
        }
    },
    props:[
        'lists'
    ]
}
</script>
