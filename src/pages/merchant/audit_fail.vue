<template>
  <div id="audit_fail">
    <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
    <div class="content">
      <p class="text warn">
        对不起，您的审核失败，经核实，您的营业执照有问题，请提供
        有效的营业执照,再重新提交审核信息。
      </p>
      <button class="reapply" @click="toSetShop">重新申请</button>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
    export default {
      name: "audit_fail",
      components:{head_bar},
      data(){
        return{
          back_last:true,
          tab_c:true,
          head:'我的商铺',
          bg_color:'#f4f3f0',
        }
      },
      methods:{
        toSetShop(){
          this.$router.push({path:'/setShop'})
        }
      },
      mounted(){
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
 #audit_fail{
   padding-top: 90px;
   min-height: 100%;
   background-color: @bg-b;
   .content{
     padding: 20px 46px 0 32px;
     .text{
       margin-bottom: 40px;
     }
     .reapply{
       display: block;
       border: none;
       .mixin-setButton(500px,60px,@W1,@G1,24px,none);
       .mixin-borderRadius(10px);
       margin: 0 auto;
     }
   }
 }
</style>
