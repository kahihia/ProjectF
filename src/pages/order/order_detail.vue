<template>
  <div id="order_detail">
    <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :bg_color="bg_color"></head_bar>
    <div class="all_wrap">
      <div class="order_detail card">
        <div class="order_in">
          <div class="top_line">
            <div class="img_box"><img v-if="order_info.merchants_imgArr" :src="imgUrl(order_info.merchants_imgArr[0])" class="mixin-img"/></div>
            <span class="good_name c-b">{{order_info.merchants_name}}</span>
            <div class="mixin-right status">
              <em class="e_k" v-if="order_info.goods_order_status==0">待付款</em>
              <em class="c-q" v-else-if="order_info.goods_order_status==1">待使用</em>
              <em class="c-b" v-else-if="order_info.goods_order_status==2">已取消</em>
              <em class="c-a" v-else-if="order_info.goods_order_status==3">待评价</em>
              <em class="c-b" v-else-if="order_info.goods_order_status==4">已失效</em>
              <em class="c-b" v-else-if="order_info.goods_order_status==5">已评价</em>
            </div>
          </div>
          <div class="info_line">
            <div class="name t-b c-Bd">
              <div class="identification">
                <img v-show="order_info.is_official==1" class="ident-img" src="@/assets/images/common/findif.png">
                <img v-show="order_info.merchants_goods_type==2&&order_info.is_official==0" class="ident-img" src="@/assets/images/common/spell.png">
                <p class="ellipsis good-name">{{order_info.merchants_goods_name}}</p>
              </div>
            </div>
            <div class="up_info">
              <div class="good_img"><img v-if="order_info.goods_imgArr" :src="imgUrl(order_info.goods_imgArr[0])" class="mixin-img"/></div>
              <div class="text_info">
                <!--<div class="item_info c-a"><span>{{order_info.merchants_goods_name}}</span><span>￥{{order_info.merchatns_goods_platform_discount_price }}</span></div>-->
                <div class="item_info c-a" v-if="order_info.goods_order_goods_field">
                  日期:{{order_info.goods_order_goods_field.split(' ')[0]}}
                  <!--<span>日期:{{order_info.goods_order_goods_field.split(' ')[0]}}</span>-->
                  <!--<span class="original c-b">￥{{order_info.merchatns_goods_platform_price}}</span>-->
                </div>
                <div class="item_info c-a" v-if="order_info.goods_order_goods_field"><span>时间:{{order_info.goods_order_goods_field.split(' ')[1]}}</span></div>
                <div class="item_info c-a" v-if="order_info.goods_order_goods_field">
                  <span class="c-Bd">￥{{order_info.merchatns_goods_platform_discount_price}}</span>
                  <span class="original c-b">￥{{order_info.merchatns_goods_platform_price}}</span>
                </div>
              </div>
            </div>
            <div class="down_info" v-show="Number(order_info.goods_order_user_coupons_money)!=0">
              <span class="c-a">优惠券</span>
              <em class="c-k">-￥{{order_info.goods_order_user_coupons_money}}</em>
              <!--<em class="c-k" v-if="order_info.goods_order_user_coupons_money">-￥{{order_info.goods_order_user_coupons_money}}</em>-->
              <!--<em class="c-j" v-else>暂无优惠券</em>-->
            </div>
          </div>
          <div class="place" @click="wxLocation">
            <img src="./images/place.png">
            <span class="p_a" v-show="order_info.is_official==0">{{order_info.merchants_address}}</span>
            <span class="p_a" v-show="order_info.is_official==1">{{order_info.merchants_goods_address}}</span>
          </div>
          <div class="down_wrap">
            <div class="up_line">
              <span class="c-a">商品折扣</span>
              <em class="c-k">-￥{{order_info.merchatns_goods_platform_price-
                order_info.merchatns_goods_platform_discount_price}}</em>
            </div>
            <div class="up_line">
              <span class="c-a">优惠券折扣</span>
              <em class="c-k">-￥{{order_info.goods_order_user_coupons_money}}</em>
            </div>
            <div class="bill_line">
              <span class="c-a">余额抵扣</span>
              <em class="c-k">-￥{{order_info.goods_order_user_bill_money}}</em>
            </div>
            <div class="mid_line">
              <span class="c-a">实付</span><em class="c-Bb">￥{{order_info.goods_order_money}}</em>
            </div>
            <div v-if="$route.query.role!=='merchant'">
              <div class="btn_wrap" v-show="order_info.goods_order_status==0">
                <button @click="cancelOrder">取消订单</button>
                <button @click="buyNow(order_info.id)">立即付款</button>
              </div>
              <div class="btn_wrap" v-show="order_info.goods_order_status==1">
                <button @click="cancelOrder">取消订单</button>
                <button @click="showQRcode(order_info.goods_imgArr[0])">立即使用</button>
              </div>
              <div class="btn_wrap" v-show="order_info.goods_order_status==3">
                <button @click="onceAgain(order_info.merchants_goods_merchants_id)">再来一单</button>
                <button @click="reportEva(order_info.id,order_info.goods_imgArr[0])">立即评价</button>
              </div>
              <div class="btn_wrap" v-show="order_info.goods_order_status==4|order_info.goods_order_status==5|order_info.goods_order_status==2">
                <button @click="deleteOrder">删除订单</button>
                <button @click="onceAgain(order_info.merchants_goods_merchants_id)">再来一单</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order_info card">
        <div class="up_line">
          <img src="./images/icon_info.png"/>
          <span class="c-a">订单信息</span>
        </div>
        <div class="mid_line c-Bc">
          <p v-if="order_info.goods_order_no">订单编码：{{order_info.goods_order_no}}</p>
          <p v-if="order_info.goods_order_inputtime">创建时间：{{order_info.goods_order_inputtime}}</p>
          <p v-if="order_info.goods_order_pay_time">付款时间：{{order_info.goods_order_pay_time}}</p>
          <p v-if="order_info.goods_order_complete_time">成交时间：{{order_info.goods_order_complete_time}}</p>
        </div>
        <a v-if="$route.query.role!=='merchant'" class="down_line c-q" :href="'tel:'+order_info.merchants_phone">联系卖家</a>
      </div>
      <div class="warn">
        <p v-if="$route.query.role!=='merchant'">如需取消，请在开场前{{order_info.merchants_goods_cancel_order_time}}小时取消订单</p>
      </div>
    </div>
    <div class="QRcode_dialog">
      <x-dialog v-model="QRcode_show" class="dialog-demo">
        <div class="order_qr">
          <div class="clearfix">
            <img src="../../assets/images/icon/icon_close.png"
                 class="close_btn" @click="hideQR"/>
          </div>
          <p class="t_e">{{order_info.merchants_goods_name}}</p>
          <qrcode class="qrcode" v-if="order_info.merchants_goods_is_meituan==0" :value="JSON.stringify(barcode)"></qrcode>
          <qrcode class="qrcode" v-if="order_info.merchants_goods_is_meituan==1" :value="barcode"></qrcode>
          <p class="c-b">请向商家展示此二维码</p>
        </div>
      </x-dialog>
    </div>
    <div class="hint" v-transfer-dom>
      <confirm v-model="hint_show"
               title="操作提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定删除吗？</p>
      </confirm>
    </div>
    <div class="hint" v-transfer-dom>
      <confirm v-model="del_show"
               title="操作提示"
               @on-confirm="onConfirmDel">
        <p style="text-align:center;">确定删除吗？</p>
      </confirm>
    </div>
    <div class="audit" v-transfer-dom>
      <alert v-model="alert_show">{{alert_content}}</alert>
    </div>
  </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime} from '@/utils/format';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {cutArr} from '@/utils/utils';
  import {wxPayment} from '@/utils/wxInit';
  import {openLocation} from '@/utils/wxInit'
  import {Qrcode,XDialog,Popup,Confirm,Alert,TransferDomDirective as TransferDom} from 'vux';
  let timeInterval;
  export default {
    name: "order_detail",
    components: {head_bar,Qrcode,XDialog,Popup,Confirm,Alert},
    directives: {TransferDom},
    data(){
        return{
          tab_c:true,
          back_last:true,
          head:'订单详情',
          bg_color:'#f4f3f0',
          user_info:getLocalData('user_info'),
          timeStamp:formatDateTime(new Date()),//时间戳
          order_id:'',//订单id
          order_info:{},//订单详情数据
          QRcode_show:false,//二维码弹窗
          barcode:{},//二维码数据
          hint_show:false,//取消订单弹窗
          del_show:false,//删除订单弹窗
          alert_show:false,//删除订单弹窗
          alert_content:'',//删除订单弹窗
        }
      },
    methods:{
      hideQR(){
        this.QRcode_show=false;
        clearInterval(timeInterval);
      },
      showQRcode(good_img){
        if(this.order_info.merchants_goods_is_meituan==0){
          this.barcode={
            // merchants_id:this.order_info.merchants_goods_merchants_id,
            user_id:this.order_info.goods_order_user_id,
            goods_id:this.order_info.goods_order_goods_id,
            barcode:this.order_info.goods_order_code
          };
          this.QRcode_show=true;
          this.watchBarcode(good_img)
        }else if(this.order_info.merchants_goods_is_meituan==1){
          this.barcode=this.order_info.goods_order_meituan_code;
          this.QRcode_show=true;
        }
      },
      watchBarcode(good_img){
        timeInterval=setInterval(()=>{
          let params = {
            user_id:this.barcode.user_id,
            goods_id:this.barcode.goods_id,
            barcode:this.barcode.barcode,
            timeStamp:this.timeStamp
          };
          request.monitorMerchantsGoodsBarcode(params).then(res=>{
            if(res.data.code==200){
              clearInterval(timeInterval);
              this.$router.push({
                path:'/writeOffSuc',
                query:{good_id:this.barcode.goods_id,good_img:good_img}
              })
            }
          })
        },3000)
      },
      getOrderInfo(order_id){//获取订单详情
        let params={
          user_id:this.user_info.id,
          id:order_id,
          timeStamp:this.timeStamp
        };
        request.getGoodsOrderInfo(params).then(res=>{
          this.$store.commit('updateLoadingStatus', {isLoading: false});
          this.order_info=res.data.data;
          this.order_info.merchants_imgArr = cutArr(this.order_info.merchants_img);
          this.order_info.goods_imgArr = cutArr(this.order_info.merchants_goods_img);
        })
      },
      getQuery(){
        this.order_id = this.$route.query.order_id;
        if(this.order_id){
          this.getOrderInfo(this.order_id)
        }
      },
      payCancel(){
        let that = this;
        that.$store.commit('updateLoadingStatus', {isLoading: false});
      },
      buyNow(id){
        let that = this;
        that.$store.commit('updateLoadingStatus', {isLoading: true});
        wxPayment(id,that.payCancel,that.getQuery)
      },
      cancelOrder(){
        this.hint_show=true;
      },
      cancelOrderFn(order_id){
        let params={
          id:order_id,
          user_id:this.user_info.id,
          timeStamp:this.timeStamp
        };
        request.cancelGoodsOrder(params).then(res=>{
          if(res.data.code==200){
            this.getOrderInfo(this.order_id);
          }else {
            this.alert_show=true;
            this.alert_content=res.data.message;
          }
        })
      },
      //确认取消？
      onConfirm(){
        this.cancelOrderFn(this.order_id)
      },
      deleteOrder(){
        this.del_show=true;
      },
      deleteOrderFn(order_id){
        let params={
          id:order_id,
          user_id:this.user_info.id,
          timeStamp:this.timeStamp,
        };
        request.deleteGoodsOrder(params).then(res=>{
          if(res.data.code==200){
            this.$router.push({path:'/orderList'})
          }else {
            this.alert_show=true;
            this.alert_content=res.data.message;
          }
        })
      },
      //确认删除？
      onConfirmDel(){
        this.deleteOrderFn(this.order_id)
      },
      onceAgain(merchants_id){
        this.$router.push({path:'/shopdetail',query:{merchant_id:merchants_id}})
      },
      reportEva(order_id,goods_img){
        this.$router.push({path:'/evaluate',query:{order_id:order_id,goods_img:goods_img}})
      },
      wxLocation(){
        if(this.order_info.is_official==0){
          openLocation(this.order_info.merchants_latitude,this.order_info.merchants_longitude,this.order_info.merchants_name,this.order_info.merchants_address,this.$newHttpsSrc)
        }else if(this.order_info.is_official==1){
          openLocation(this.order_info.merchants_goods_address_latitude,this.order_info.merchants_goods_address_longitude,this.order_info.merchants_name,this.order_info.merchants_goods_address,this.$newHttpsSrc)
        }
      }
    },
    created(){
      clearInterval(timeInterval)
    },
    mounted(){
      this.$nextTick(()=>{
        this.getQuery();
      });
      this.$store.commit('updateBottomNav', {showBottomNav: false});
      },
    destroyed(){
      clearInterval(timeInterval)
      this.$store.commit('updateBottomNav', {showBottomNav: true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  .marginR20{margin-right: 20px}
  .marginR8{margin-right: 8px}
  .card{
    background-color: @W1;
    box-shadow: 0 0 15px 0
    rgba(0, 1, 1, 0.05);
    .mixin-borderRadius(10px);
  }
  #order_detail{
    min-height: 100%;
    background-color: @bg-b;
    padding: 90px 0 20px;
    .all_wrap{
      padding-top: 20px;
      width: 686px;
      margin: 0 auto;
      .order_detail{
        width: 100%;
        padding: 40px 20px;
        margin-bottom: 16px;
        .order_in{
          .top_line{
            position: relative;
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
            .status{
              em{
                display: block;
                padding: 8px 15px;
                .mixin-borderRadius(20px);
                border: 1px solid;
              }
            }
          }
          .info_line{
            padding: 17px 0 20px 0;
            border-top:1px solid @border_c;
            .name{
              margin-bottom: 20px;
              .identification{
                display: flex;
                align-items: center;
                .ident-img{
                  min-width: 70px;
                  min-height: 30px;
                  width:  70px;
                  height: 30px;
                }
                .good-name{
                  max-width: 85%;
                  margin-left: 10px;
                }
              }
            }
            .up_info{
              display: flex;
              /*align-items: center;*/
              /*justify-content: space-between;*/
              .good_img{
                width: 170px;
                height: 170px;
              }
              .text_info{
                /*width: 455px;*/
                /*height: 90px;*/
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                /*justify-content: space-between;*/
                .item_info{
                  display: flex;
                  /*justify-content: space-between;*/
                  align-items: center;
                  margin-top: 20px;
                  &:nth-of-type(1){
                    margin-top: 0;
                  }
                  .original{
                    text-decoration: line-through;
                    margin-left: 30px;
                  }
                }
              }
            }
            .down_info{
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 36px;
            }
          }
          .place{
            display: flex;
            align-items: center;
            padding: 30px 0 ;
            span{
              margin-left: 14px;
            }
          }
          .down_wrap{
            .up_line,.bill_line{
              border-top:1px solid @border_c;
              display: flex;
              justify-content: space-between;
              padding: 20px 0;
            }
            .bill_line{
              border-top:1px solid @border_c;
            }
            .mid_line{
              display: flex;
              justify-content: flex-end;
              align-items: center;
              width: 100%;
              padding: 20px 0;
              border-top:1px solid @border_c;
              border-bottom:1px solid @border_c;
            }
            .btn_wrap{
              padding-top: 30px;
              display: flex;
              justify-content: flex-end;
              button{
                border: none;
                .mixin-setButton(140px,60px,@G1,@bg-c,24px,none);
                .mixin-borderRadius(8px);
                &:first-child{
                  border: solid 2px @border_e;
                  margin-right: 40px;
                }
                &:last-child{
                  background-color: @sign_bg;
                }
              }
            }
          }
        }
      }
      .order_info{
        padding: 37px 20px 19px;
        .up_line{
          display: flex;
          align-items: center;
          padding-bottom: 22px;
          img{
            margin-right: 8px;
          }
        }
        .mid_line{
          padding: 20px 36px;
          border-top: 1px solid @border_c;
          border-bottom: 1px solid @border_c;
          p{
            margin-bottom: 20px;
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
        .down_line{
          display: block;
          padding-top: 20px;
          text-align: center;
        }
      }
      .warn{
        margin-top: 20px;
        p{
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }
</style>
<style lang="less">
  #order_detail{
    .weui-dialog{
      max-width: 500px;
      height: 444px;
      box-sizing: border-box;
      padding: 20px 20px 40px;
      text-align: center;
      .close_btn{
        float: right;
      }
      .qrcode{
        padding: 40px 0 20px;
        img{
          width: 250px !important;
          height: 250px !important;
        }
      }
    }
  }
</style>
