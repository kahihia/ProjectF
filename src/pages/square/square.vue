<template>
    <div id="square">
  `   <head_bar :headTitle="head_title" :tab_d="true" :tab_d_img="2" :bg_color="bg_color"></head_bar>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
    export default {
      name: "square",
      components:{head_bar},
      data(){
        return{
          head_title:'广场',
          bg_color:'#f4f3f0',//头部背景色
        }
      },
      created(){
        this.$store.commit('selectedTab',{tab_index:1});
        this.$store.commit('userOrMerchant',{is_merchant:false});//显示用户端tabbar
      },
    }
</script>

<style scoped>

</style>
