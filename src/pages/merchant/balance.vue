<template>
    <div id="balance">
      <head_bar :backLast="back_last" :tab_c="true" :head="head" :bg_color="bg_color"
                :show_right="true" right_text="收支明细" @showList="toBudget">
      </head_bar>
      <div class="content">
        <div class="up_wrap"><img src="./images/balance_coin.png"></div>
        <div class="down_wrap">
          <p class="c-a">我的余额</p>
          <p class="user_bill t_f">¥{{merchants_bill}}</p>
          <button class="get_money" @click="withdrawal">提现</button>
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
      name: "balance",
      components:{head_bar},
      data(){
        return{
          back_last:true,
          head:'余额',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),//时间戳
          merchants_bill:'',//商家余额
          role:this.$route.query.role,
        }
      },
      methods:{
        withdrawal(){
          this.$router.push({
            path:'/withdrawal',
            query:{role:this.role}
          })
        },
        // 获取商铺余额
        getMerchantsBill(){
          let params={
            merchants_id:this.user_info.merchants_id,
            timeStamp:this.timeStamp
          };
          request.getMerchantsBill(params).then(res=>{
            this.merchants_bill=res.data.data
          })
        },
        // 获取用户余额
        getUserBill(){
          let params={
            user_id:this.user_info.id,
            timeStamp:this.timeStamp
          };
          request.getUserBill(params).then(res=>{
            this.merchants_bill=res.data.data
          })
        },
        toBudget(){
          this.$router.push({
            path:'/paymentList',
            query:{role:this.role}
          })
        },
        judgeUsMer(){
          if(this.role==='merchant'){
            this.getMerchantsBill();
            this.bg_color='#ffe035'
          }else if(this.role==='user'){
            this.getUserBill()
          }
        }
      },
      mounted(){
        this.judgeUsMer();
        this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
      destroyed(){
        this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #balance{
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    .content{
      padding: 240px 125px 0;
      text-align: center;
      .down_wrap{
        margin-top: 40px;
        .user_bill{
          margin-top: 20px;
        }
        .get_money{
          margin-top: 80px;
          .mixin-setButton(100%,60px,@W1,@G1,24px,none);
          border: none;
          .mixin-borderRadius(8px);
        }
      }
    }
  }
</style>
