<template>
  <div id="paymentList">
    <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
    <div class="content">
      <div class="budget_wrap card" v-if="budget_list.length>0">
        <div class="budget_item" v-for="(item,index) in budget_list" @click="toDetail(item.id,item.user_id,item.merchants_id,item.goods_order_id)">
          <div class="left_wrap">
            <div class="goods_name c-Bd">{{item.cost_instructions}}</div>
            <div class="date_time c-j">{{item.inputtime}}</div>
          </div>
          <div class="right_warp">
            <span :class=" isPlus(item.cost)?'e_i':'t_e'">{{item.cost}}</span>
          </div>
        </div>
      </div>
      <div class="mixin-center c-a" v-else>
        {{budget_data.message}}
      </div>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {getLocalData} from '@/utils/storages';
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "paymentList",
      components:{head_bar},
      data(){
        return{
          head:'收支明细',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          budget_list:[],//余额列表
          budget_data:[],//余额数据
          role:this.$route.query.role,//角色
        }
      },
      methods:{
        toDetail(bill_id,user_id,merchants_id,order_id){
          if(order_id){
            this.$router.push({
              path:'/paymentDetail',
              query:{
                role:this.role,
                bill_id:bill_id,
                user_id:user_id,
                merchants_id:merchants_id
              }
            })
          }
        },
        getMerchantsBillLi(){
          let params={
            merchants_id:this.user_info.merchants_id,
            timeStamp:formatDateTime(new Date())
          };
          request.getMerchantsBillLists(params).then(res=>{
            this.budget_list=res.data.data;
            this.budget_data=res.data;
          })
        },
        getUserBillLi(){
          let params={
            user_id:this.user_info.id,
            timeStamp:formatDateTime(new Date())
          };
          request.getUserBillLists(params).then(res=>{
            this.budget_list=res.data.data;
            this.budget_data=res.data;
          })
        },
        judgeUsMer(){
          if(this.role==='merchant'){
            this.getMerchantsBillLi();
            this.bg_color='#ffe035'
          }else {
            this.getUserBillLi()
          }
        }
      },
      created(){
        this.judgeUsMer()
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
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px);
  }
  #paymentList{
    position: relative;
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .content{
      padding: 20px 32px;
      .budget_wrap{
       .budget_item{
         padding: 30px 20px;
         display: flex;
         align-items: center;
         justify-content: space-between;
         border-bottom: 1px solid @border_c;
         &:last-child{
           border-bottom: none;
         }
         .right_warp{
           span{
             font-weight: bold;
           }
         }
       }
      }
    }
  }
</style>
