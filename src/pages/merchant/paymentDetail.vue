<template>
    <div id="paymentDetail">
      <head_bar :backLast="true" :tab_c="true" :head="head" :bg_color="bg_color"></head_bar>
      <div class="container">
        <div class="payment-info card">
          <div class="up-wrap" @click="toGoods(billInfo.goods_order_goods_id)">
            <div class="head-img">
              <img class="mixin-img" :src="imgUrl(billInfo.merchants_goods_img.split(',')[0])">
            </div>
            <p class="t-b-d good-name">{{billInfo.merchants_goods_name}}</p>
            <p class="c-b good-field" v-show="billInfo.goods_order_goods_field">场次：{{billInfo.goods_order_goods_field}}</p>
            <p :class="isPlus(billInfo.cost)?'e_h cost':'c-Bf cost'">{{billInfo.cost}}</p>
          </div>
          <div class="down-wrap">
            <div class="order-item">
              <div class="down-title c-o">账单说明</div>
              <div class="down-info t-b-a">{{billInfo.cost_instructions}}</div>
            </div>
            <div class="order-item">
              <div class="down-title c-o">结算时间</div>
              <div class="down-info t-b-a">{{billInfo.inputtime}}</div>
            </div>
            <div class="order-item c-o">
              <div class="down-title">订单号</div>
              <div class="down-info t-b-a" v-show="role==='user'" @click="toOrderInfo">{{billInfo.goods_order_no}}</div>
              <div class="down-info t-b-a">
                <div v-show="role==='merchant'" v-for="(item,index) in billInfo.goods_order_nos" @click="toOrderInfo(index)">
                  {{item}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
    export default {
      name: "paymentDetail",
      components:{head_bar},
      data(){
        return{
          head:'明细详情',
          bg_color:'#f4f3f0',
          role:this.$route.query.role,//角色
          user_id:this.$route.query.user_id,
          merchants_id:this.$route.query.merchants_id,
          timeStamp:formatDateTime(new Date()),//时间戳
          bill_id:this.$route.query.bill_id,
          billInfo:[]
        }
      },
      methods:{
        toGoods(good_id){
          this.$router.push({
            path:'/goodsdetail',
            query:{good_id:good_id}
          })
        },
        toOrderInfo(index){
          if(this.role==='user'){
            this.$router.push({
              path:'/orderDetail',
              query:{order_id:this.billInfo.goods_order_id}
            })
          }else if(this.role==='merchant'){
            let order_id=this.billInfo.goods_order_ids[index];
            this.$router.push({
              path:'/orderDetail',
              query:{order_id:order_id}
            })
          }
        },
        getUserBillInfo(){
          let params={
            user_id:this.user_id,
            bill_id:this.bill_id,
            timeStamp:formatDateTime(new Date()),
          };
          request.getUserBillInfo(params).then(res=>{
            this.billInfo=res.data.data
          })
        },
        getMerchantsBillInfo(){
          let params={
            merchants_id:this.merchants_id,
            bill_id:this.bill_id,
            timeStamp:formatDateTime(new Date())
          };
          request.getMerchantsBillInfo(params).then(res=>{
            this.billInfo=res.data.data
          })
        },
        getBillInfo(){
          if(this.role==='user'){
            this.getUserBillInfo()
          }else if(this.role==='merchant'){
            this.getMerchantsBillInfo();
            this.bg_color='#ffe035'
          }
        },
      },
      mounted(){
        this.getBillInfo();
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
  #paymentDetail{
    position: relative;
    width: 100%;
    background-color: @bg-b;
    min-height: 100%;
    padding-top: 90px;
    .container{
      padding: 20px 32px;
      .payment-info{
        padding: 40px 30px 80px;
        .up-wrap{
          text-align: center;
          padding-bottom: 80px;
          border-bottom: 1px solid @border_c;
          .head-img{
            width: 120px;
            height: 120px;
            .mixin-borderRadius(50%);
            overflow: hidden;
            margin: 0 auto;
          }
          .good-name{
            margin: 30px 0;
          }
          .good-field{
            margin-bottom: 28px;
          }
          .cost{
            font-weight: bold;
          }
        }
        .down-wrap{
          padding-top: 10px;
          .order-item{
            margin-top: 30px;
            display: flex;
            .down-title{
              width: 20%;
            }
            .down-info{
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
</style>
