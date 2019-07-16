<template>
    <div id="order_confirm">
      <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
      <div class="order_all">
        <div class="order_detail">
          <div class="order_in">
            <div class="top_line">
              <div class="img_box"><img :src="imgUrl(order_info.up_merchants_img)" class="mixin-img"/></div>
              <span class="good_name c-b">{{order_info.merchants_name}}</span>
            </div>
            <div class="info_line">
              <div class="up_info">
                <div class="good_img"><img :src="imgUrl(order_info.up_goods_img)" class="mixin-img"/></div>
                <div class="text_info">
                  <div class="item_info c-a">
                    <span>{{order_info.merchants_goods_name}}</span>
                    <span class="price_orig">
                      <span class="original c-j">￥{{order_info.merchatns_goods_platform_price}}</span>
                      <span>￥{{order_info.merchatns_goods_platform_discount_price}}</span>
                    </span>
                  </div>
                  <div class="item_info c-j">
                    <inline-x-number width="50px" :min="1" v-model="goods_num"
                                     v-if="order_info.merchants_goods_type==1">
                    </inline-x-number>
                    <span v-if="order_info.merchants_goods_type==2">拼团场次:{{order_info.goods_order_goods_field}}</span>
                  </div>
                </div>
              </div>
              <div class="place" @click="wxLocation">
                <img src="./images/place.png">
                <span class="p_a" v-show="order_info.is_official==0">{{order_info.merchants_address}}</span>
                <span class="p_a" v-show="order_info.is_official==1">{{order_info.merchants_goods_address}}</span>
              </div>
              <div class="down_info" @click="showVoucher()">
                <span class="c-a">优惠券</span>
                <em class="c-j" v-if="JSON.stringify(choose_coupon)=='{}'&&coupon_list.length===0">暂无优惠券</em>
                <em class="c-k" v-if="JSON.stringify(choose_coupon)=='{}'&&coupon_list.length>0">请选择优惠券</em>
                <em class="c-k" v-if="JSON.stringify(choose_coupon)!='{}'">{{choose_coupon.goods_order_user_coupons_money}}
                  <!--<span v-if="choose_coupon.merchants_coupons_type==1">-￥{{choose_coupon.merchants_coupons_discount}}</span>-->
                  <!--<span v-if="choose_coupon.merchants_coupons_type==2"><i>{{Number(choose_coupon.merchants_coupons_discount)}}折</i></span>-->
                  <span>{{coupon_reduce}}</span>
                </em>
              </div>
            </div>
            <div class="down_line"><span class="c-j marginR20">已优惠￥{{already_dis}}</span><span class="c-a marginR8">小计</span><em class="c-Bb">￥{{Subtotal}}</em></div>
          </div>
        </div>
        <div class="payment">
          <div class="up_line">
            <span class="c-a">余额支付<span class="c-b">(<em class="c-k">{{user_bill}}</em>)</span></span>
            <inline-x-switch class="cell_switch" title="" v-model="balance"></inline-x-switch>
          </div>
          <!--<x-icon type="ios-circle-outline" size="30"></x-icon>-->
        </div>
      </div>
      <div class="bottom">
        <div class="price_info">
          <span class="c-l">已优惠￥{{finalDis}}</span>
          <div class="price_box">
            <p class="c-m">合计</p>
            <p class="t_d">￥{{total_price}}</p>
          </div>
        </div>
        <button class="confirm_btn" @click="showOrder">提交订单</button>
      </div>
      <!--优惠券列表-->
      <div class="voucher_wrap" v-transfer-dom>
        <popup v-model="show_voucher" position="bottom" max-height="50%">
          <div class="head_title">
            <p class="title t-b">
              <span @click="noUseCoupon" class="_left c-b">暂不使用</span>
              优惠详情
              <span @click="show_voucher=false" class="mixin-right"><img src="../../assets/images/icon/close.png"></span>
            </p>
          </div>
          <div class="voucher-list">
            <div class="voucher-item" v-for="(item,index) in coupon_list" @click="useCoupon(item.id,index)" :style="'background:url('+item.catCoupon_img+') no-repeat 50% 50% ;color:'+item.coupon_color+';'">
              <div class="item-left">
                <div class="left_wrap">
                  <p class="coupon_name">{{item.coupons_name}}</p>
                  <ul class="condition">
                    <li>满{{item.merchants_coupons_use_standard}}使用</li>
                    <li>{{item.merchants_name}}</li>
                  </ul>
                  <p class="overtime">使用期限：{{item.merchants_coupons_overtime}}</p>
                </div>
                <div class="right_wrap">
                  <em v-if="item.merchants_coupons_type==1">￥ <i class="numFs">{{item.merchants_coupons_discount}}</i></em>
                  <em v-if="item.merchants_coupons_type==2"><i class="numFs">{{Number(item.merchants_coupons_discount)}}</i>折</em>
                </div>
              </div>
              <div class="item-right" v-show="!item.use_coupon">立即使用</div>
              <div class="item-right c-b" v-show="item.use_coupon">已使用</div>
            </div>
          </div>
        </popup>
      </div>
      <div class="order_pop" v-transfer-dom>
        <popup v-model="show_order" position="bottom" max-height="50%" :hide-on-blur="false">
          <div class="pop_order">
            <div class="head_title">
              <img src="../../assets/images/icon/icon_close.png" class="_left" @click="hideOrder"/>
              <p class="goods_name t_e align_center">{{order_info.merchants_goods_name}}</p>
            </div>
            <ul class="order_info">
              <li v-for="(item,index) in info_li" class="info_item">
                <span class="c-a">{{item.title}}</span>
                <span :class="item.status?'c-w':'c-a'" v-if="!item.alone">{{item.value}}</span>
                <span :class="item.status?'c-w':'c-a'" v-else-if="item.alone & item.id===3">{{coupon_reduce}}</span>
                <span :class="item.status?'c-w':'c-a'" v-else-if="item.alone & item.id===4">{{balance_reduce}}</span>
              </li>
            </ul>
            <div class="confirm_price">￥{{total_price}}</div>
            <button class="confirm_again" @click="submitGoodsOrder"><span class="final">确认支付{{total_price}}元</span><loading :showLoad="show_load"></loading></button>
            <p class="warn cancel_confirm">如需取消订单，请在开场前{{order_info.merchants_goods_cancel_order_time}}小时取消订单</p>
          </div>
        </popup>
      </div>
      <div class="audit" v-transfer-dom>
        <alert v-model="alert_show">{{alert_content}}</alert>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar';
  import loading from '@/components/loading';
  import { InlineXSwitch,InlineXNumber,Alert,TransferDomDirective as TransferDom,Popup} from 'vux';
  import ButtonTab from "vux/src/components/button-tab/button-tab";
  import {getLocalData} from '@/utils/storages';
  import {cutArr} from '@/utils/utils';
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {wxPayment} from '@/utils/wxInit';
  import {openLocation} from '@/utils/wxInit'
    export default {
      name: "order_confirm",
      directives: {TransferDom},
      components: {ButtonTab,head_bar,InlineXSwitch,InlineXNumber,Popup,loading,Alert},
      data(){
        return{
          tab_c:true,
          back_last:true,
          head:'确认订单',
          bg_color:'#ffe035',
          field:false,//关闭拼团
          show_voucher:false,//显示隐藏优惠券列表
          show_order:false,//显示隐藏订单弹窗
          balance:false,
          user_info: getLocalData('user_info'),//用户信息
          timeStamp:formatDateTime(new Date()),//时间戳
          order_info:[],//订单详情
          user_bill:null,//用户余额
          coupon_id:null,//用户拥有优惠券id
          use_coupon:false,//是否使用优惠券
          coupon_list:[],//用户拥有优惠券id
          choose_coupon:{},
          goods_num:1,//商品数量
          info_li:[],
          show_load:false,
          alert_show:false,
          alert_content:'',
          bgColor:[
            {id:'',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
            {id:'0',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
            {id:'1137',img:require('@/assets/images/common/eatDrink.png'),color:'#f0614c'},
            {id:'1138',img:require('@/assets/images/common/palyer.png'),color:'#a45af5'},
            {id:'1139',img:require('@/assets/images/common/sport.png'),color:'#16d37d'},
            {id:'1140',img:require('@/assets/images/common/travel.png'),color:'#3884eb'}
          ]
        }
      },
      computed:{
        num_price(){
          return Math.floor(this.order_info.merchatns_goods_platform_discount_price*this.goods_num*100)/100
        },
        origin_price(){
          return Math.floor(this.order_info.merchatns_goods_platform_price*this.goods_num*100)/100
        },
        Subtotal(){
          let sub_price=this.num_price;
          if(this.use_coupon){
            if(this.choose_coupon.merchants_coupons_type==1){
              sub_price=sub_price-this.choose_coupon.merchants_coupons_discount;
            }else if(this.choose_coupon.merchants_coupons_type==2){
              let disMoney = sub_price*this.choose_coupon.merchants_coupons_discount/10;
              let upperMoney = sub_price-this.choose_coupon.merchants_coupons_upper_limit_money;
              if(this.choose_coupon.merchants_coupons_upper_limit_money){
                if(disMoney<upperMoney){
                  sub_price=upperMoney;
                }else {
                  sub_price=disMoney;
                }
              }else {
                sub_price=disMoney;
              }
            }
          }
          return sub_price>=0?Math.floor(sub_price*100)/100:0;
        },
        already_dis(){
          return Math.floor(this.origin_price*100)/100-Math.floor(this.Subtotal*100)/100;
        },
        total_price(){
          let total_price=this.Subtotal;
          if(this.balance){
            total_price=this.user_bill-this.Subtotal;
            if(total_price>=0){
              total_price=0
            }else {
              total_price=Math.abs(total_price)
            }
          }
          return Math.floor(total_price*100)/100
        },
        finalDis(){
          let final_dis = this.already_dis;
          final_dis=this.origin_price-this.total_price;
          return Math.floor(final_dis*100)/100;
        },
        coupon_reduce(){//优惠券折扣
          return Math.floor(this.Subtotal*100)/100-Math.floor(this.num_price*100)/100;
        },
        balance_reduce(){//余额抵扣
          let balance_reduce=0;
          balance_reduce=this.total_price-this.Subtotal;
          return Math.floor(balance_reduce*100)/100
        },
      },
      methods:{
        wxLocation(){
          if(this.order_info.is_official==0){
            openLocation(this.order_info.merchants_latitude,this.order_info.merchants_longitude,this.order_info.merchants_name,this.order_info.merchants_address,this.$newHttpsSrc)
          }else if(this.order_info.is_official==1){
            openLocation(this.order_info.merchants_goods_address_latitude,this.order_info.merchants_goods_address_longitude,this.order_info.merchants_name,this.order_info.merchants_goods_address,this.$newHttpsSrc)
          }
        },
        // 使用优惠券
        showVoucher(){
          if(this.coupon_list.length>0){
            this.show_voucher=true;
          }
        },
        // 暂不使用优惠券
        noUseCoupon(){
          this.coupon_list.map((val,key)=>{
              val.use_coupon=false;
              this.use_coupon=this.choose_coupon.use_coupon;
              this.show_voucher=false;
              this.choose_coupon={};
              this.coupon_id=null;
          });
        },
        useCoupon(coupon_id,index){
          this.coupon_id=coupon_id;
          this.choose_coupon=this.coupon_list[index];
          this.coupon_list.map((val,key)=>{
            if(index!==key){
              val.use_coupon=false;
            }
          });
          this.coupon_list[index].use_coupon=true;
          this.use_coupon=this.choose_coupon.use_coupon;
          this.show_voucher=false
        },
        // 获取商品订单详情
        getOrderInfo(){
          let that = this;
          let params = {
            id:this.order_id,//order_id
            user_id:this.user_info.id,
            timeStamp:formatDateTime(new Date())
          };
          request.getGoodsOrderInfo(params).then(res=>{
            let order_info = res.data.data;
            order_info.up_merchants_img=cutArr(order_info.merchants_img)[0];
            order_info.up_goods_img=cutArr(order_info.merchants_goods_img)[0];
            this.order_info = order_info;
            this.getUserCoupons();
            this.info_li=[
              {id:1,title:'商品价格',value:order_info.merchants_goods_price,status:false},
              {id:2,title:'折扣减',value:that.inverse(that.already_dis),status:true},
              {id:3,title:'优惠券',value:0,status:true,alone:true},
              {id:4,title:'余额抵扣',value:0,status:true,alone:true}
            ];
          })
        },
        //获取用户余额
        getBill(){
          let params = {
            user_id:this.user_info.id,
            timeStamp:formatDateTime(new Date())
          };
          request.getUserBill(params).then(res=>{
            this.user_bill = res.data.data
          })
        },
        //获取用户拥有的优惠券
        getUserCoupons(){
          let that = this;
          let params = {
            user_id:String(that.user_info.id),
            merchants_id:String(that.order_info.merchants_goods_merchants_id),
            goods_type:String(that.order_info.merchants_goods_type),
            money:that.order_info.merchatns_goods_platform_discount_price,
            goods_id:that.order_info.goods_order_goods_id,
            goods_category_id:that.order_info.merchants_goods_category,
            timeStamp:formatDateTime(new Date())
          };
          if(that.order_info.merchants_goods_type==2){
            params.goods_field=that.order_info.goods_order_goods_field
          }
          request.getUserCoupons(params).then(res=>{
            this.coupon_list=res.data.data;
            that.coupon_list.length>0?that.has_notice=true:that.has_notice=false;
            this.$nextTick(()=>{
              if(that.coupon_list.length>0){
                that.coupon_list.forEach((val,key)=>{
                  val.use_coupon=false;
                  that.bgColor.forEach((item,index)=>{
                    if(val.merchants_coupons_usable_goods_category_id===item.id){
                      val.catCoupon_img=item.img;
                      val.coupon_color=item.color;
                    }
                  })
                });
              }
            });
            console.log(that.coupon_list)
          })
        },
        showOrder(){
          this.show_order=true;
        },
        hideOrder(){
          this.show_order=false;
          this.show_load=false;
        },
        payCancel(){
          let that = this;
          that.show_load=false;
          that.$store.commit('updateLoadingStatus', {isLoading: false});
          this.$router.push({path:'/orderDetail',query:{order_id:that.order_id}})
        },
        // 确认提交商品订单
        submitGoodsOrder(){
          let that = this;
          let useBill=1;
          that.balance?useBill=1:useBill=0;
          that.show_load=true;
          let params={
            id:String(that.order_id),//order_id
            is_user_bill:String(useBill),
            buy_number:String(this.goods_num),
            timeStamp:formatDateTime(new Date()),
            user_coupons_id:that.coupon_id
          };
          !that.coupon_id?delete params.user_coupons_id:'';
          if(!params.user_coupons_id) delete params.user_coupons_id;
          request.sureSubmitGoodsOrder(params).then(res=>{
            let revert = res.data;
            if(revert.code==200){
              that.getUserInfo(this.user_info.id);
              if(revert.data.need_pay==1){
                that.$store.commit('updateLoadingStatus', {isLoading: true});
                wxPayment(that.order_id,that.payCancel,that.payCancel);
              }else if(revert.data.need_pay==0){
                that.$store.commit('updateLoadingStatus', {isLoading: true});
                this.$router.push({path:'/orderDetail',query:{order_id:that.order_id}})
              }
            }else {
              this.alert_show=true;
              this.alert_content=revert.message;
              this.show_load=false;
            }
          })
        },
        // cancelOrder(){
        //   let params={
        //     id:84,//order_id
        //     user_id:this.user_info.id,
        //     timeStamp:formatDateTime(new Date())
        //   };
        //   request.cancelGoodsOrder(params).then(res=>{
        //   })
        // }
      },
      created(){
        this.order_id = this.$route.query.order_id;
        this.getOrderInfo();
        this.getBill();
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
  .marginR20{margin-right: 20px}
  .marginR8{margin-right: 8px}
  #order_confirm{
    min-height: 100%;
    background-color: @bg-b;
    padding-top: 110px;
    .order_all{
      width: 686px;
      margin: 0 auto;
      .order_detail{
        width: 100%;
        padding: 40px 20px;
        background-color: @W1;
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        .mixin-borderRadius(10px);
        .order_in{
          .top_line{
            display: flex;
            align-items: center;
            margin-bottom:16px;
            .img_box{
              width: 50px;
              height: 50px;
              .mixin-borderRadius(50%);
              overflow: hidden;
              margin-right: 8px;
            }
          }
          .info_line{
            padding: 17px 0 20px 0;
            border-top:1px solid @border_c;
            border-bottom:1px solid @border_c;
            .up_info{
              display: flex;
              /*align-items: flex-start;*/
              justify-content: space-between;
              .good_img{
                width: 170px;
                height: 170px;
              }
              .text_info{
                width: 455px;
                height: 90px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .item_info{
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  .price_orig{
                    display: flex;
                    .original{
                      text-decoration: line-through;
                    }
                  }
                }
              }
            }
            .place{
              display: flex;
              align-items: center;
              padding: 30px 0 ;
              span{
                margin-left: 14px;
              }
              border-bottom:1px solid @border_c;
            }
            .down_info{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 26px;
            }
          }
          .down_line{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 16px;
          }
        }
      }
      .payment{
        margin-top: 16px;
        padding: 32px 20px 40px;
        background-color: @W1;
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        .mixin-borderRadius(10px);
        .up_line{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .bottom{
      position: fixed;
      bottom: 0;
      display: flex;
      height: 120px;
      box-shadow: 0px -8px 15px 0px
      rgba(10, 10, 10, 0.1);
      .price_info{
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*align-items: center;*/
        width: 530px;
        height: 100%;
        background-color: @G1;
        padding: 26px 0;
        box-sizing: border-box;
        text-align: center;
        .price_box{
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .confirm_btn{
        border: none;
        .mixin-setButton(220px,100%,@G1,@Y2,30px,none);
      }
    }
  }
</style>
<style lang="less">
  .item_info{
    .vux-inline-x-number{
      .vux-number-input{
        font-size: 24px;
      }
    }
  }
  .order_pop{
    .pop_order{
      padding: 38px 40px 28px;
      .head_title{
        line-height: 28px;
        padding-bottom: 38px;
        border-bottom: 1px solid #e4e4e4;
      }
      .order_info{
        .info_item{
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
        }
      }
      .confirm_price{
        text-align: center;
        font-size:48px;
        padding: 30px 0;
      }
      .confirm_again{
        display: block;
        margin: 0 auto;
        border: none;
        width:500px;
        height:80px;
        background-color: #252525;
        color: #fff;
        font-size: 24px;
        border-radius: 8px;
        box-shadow: 0 5px 9px 0
        rgba(0, 1, 1, 0.14);
        .final{
          margin-right: 10px;
        }
      }
      .cancel_confirm{
        padding: 50px 0 30px;
        text-align: center;
      }
    }
  }
</style>
