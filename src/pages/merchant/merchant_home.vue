<template>
    <div id="merchant_home">
      <head_bar :tab_a="tab_a" :has_bg="has_bg" :left_icon="left_icon"></head_bar>
      <div class="head_content clearfix">
        <div class="t-a">
          <div class="_left left_box">
            <span class="show">在此</span>
            <span>查看订单</span>
          </div>
          <div class="_right right_box" @click="wxQRCode()">
            <div class="QR_code mixin-center"><img src="./images/QR_code.png" class="mixin-img"/></div>
          </div>
        </div>
      </div>
      <!--时间-->
      <div class="time padding40 c-b">
        <img src="../home/images/time.png"/>
        <em>{{toDay}}</em>
      </div>
      <tab custom-bar-width="60px" :line-width="8" bar-active-color="#ffe035" active-color="#363636" default-color="#959595">
        <tab-item @click.native="getOrderList(undefined)" selected>所有</tab-item>
        <tab-item @click.native="getOrderList(1)">新订单</tab-item>
        <tab-item @click.native="getOrderList(3)">历史订单</tab-item>
      </tab>
      <ul class="orderList">
        <li class="order_item" v-for="(item,index) in order_list">
          <div class="left_box">
            <div class="head_box" @click="toUserInfo(item.goods_order_user_id)"><img class="mixin-img" :src="imgUrl(item.head_img)"></div>
          </div>
          <div class="info_block" @click="toOrderInfo(item.id)">
            <div class="order_info">
              <div class="user_line">
                <span class="t-b-b user_name">{{item.user_name}}</span>
                <span class="c-a">下单</span>
                <span class="_right c-f">{{item.goods_order_inputtime}}</span>
              </div>
              <div class="under_line">
                <div class="under_left">
                  <div class="phone_num c-b">{{item.phone}}</div>
                  <div class="order_num c-b">订单号 : {{item.goods_order_no}}</div>
                </div>
                <div class="">
                  <!--<button class="write_off c-h" v-show="item.goods_order_status==1">核销</button>-->
                  <!--<button class="write_over green_btn" v-show="item.goods_order_status==3|item.goods_order_status==5">-->
                    <!--<em>&radic;</em>-->
                    <!--<span>22 Sep 11:20AM</span>-->
                  <!--</button>-->
                  <em class="c-q" v-if="item.goods_order_status==1">待使用</em>
                  <em class="c-b" v-else-if="item.goods_order_status==2">已取消</em>
                  <em class="c-q" v-else-if="item.goods_order_status==3">待评价</em>
                  <em class="c-b" v-else-if="item.goods_order_status==4">已失效</em>
                  <em class="c-b" v-else-if="item.goods_order_status==5">已评价</em>
                </div>
              </div>
            </div>
            <div class="good_block">
              <div class="good_img">
                <div class="img_box"><img class="mixin-img" :src="imgUrl(item.goods_imgArr[0])"></div>
              </div>
              <div class="good_info">
                <em class="mark mixin-centerTop" v-show="item.merchants_goods_type==2">团</em>
                <div class="good_name c-e">{{item.merchants_goods_name}}</div>
                <div class="shop_name c-e">{{item.merchants_name}}</div>
                <div class="time_slot c-e">{{item.merchants_goods_available_time}}</div>
                <div class="price_block">
                  <div>
                    <span class="t-b">
                      ￥<em class="c-Ba">{{item.merchants_goods_discount_price}}</em>
                    </span>
                    <em class="p-original c-Bc">原价 <span class="delete_line">￥{{item.merchants_goods_price}}</span></em>
                  </div>
                  <div class="c-b">已售 {{item.merchants_goods_sold}}</div>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li class="c-b mixin-center" v-show="order_list.length==0">{{order_data.message}}</li>
      </ul>
      <div class="audit" v-transfer-dom>
        <alert v-model="alert_show">{{alert_content}}</alert>
      </div>
    </div>
</template>

<script>
  import head_bar from '@/components/head_bar'
  import {formatDateTime, formatDate2} from '@/utils/format';
  import {Tab,TabItem,Alert,TransferDomDirective as TransferDom} from 'vux';
  import request from '@/utils/request';
  import {getLocalData} from '@/utils/storages';
  import {wxQRCode} from '@/utils/wxInit';
    export default {
      name: "order_list",
      components:{head_bar,Tab,TabItem,Alert},
      directives: {TransferDom},
      data(){
        return{
          tab_a:'tab_a',
          has_bg:true,
          left_icon:true,
          toDay:formatDate2(new Date()),
          user_info:getLocalData('user_info'),
          user_id:getLocalData('user_info').id,//用户id
          timeStamp:formatDateTime(new Date()),//时间戳
          order_list:[],//订单列表
          order_data:[],//订单数据
          alert_content:'',//操作提示内容
          alert_show:false,//操作提示显示
        }
      },
      methods:{
        toOrderInfo(order_id){
          this.$router.push({
            path:'/orderDetail',
            query:{order_id:order_id,role:'merchant'}
          })
        },
        toUserInfo(user_id){
          this.$router.push({
            path:'/userInfo',
            query:{user_id:user_id}
          })
        },
        getOrderList(status){
          let that = this;
          let params = this.deleteStr({merchants_id:this.user_info.merchants_id,goods_order_status:status,timeStamp:that.timeStamp});
          request.getGoodsOrderList(params).then(res=>{
            that.order_list = res.data.data;
            that.order_data = res.data;
            this.order_list.map((item,index)=>{
              item.goods_imgArr = item.merchants_goods_img.split(',');
              if(item.merchants_goods_type==2){
                let avalid_time = JSON.parse(item.merchants_goods_available_time);
                let valid_arr=[];
                let time_arr=[];
                for (let key in avalid_time){
                  valid_arr.push(that.weekFn(key));
                  time_arr=avalid_time[key];
                }
                let week_str = valid_arr.join(',');
                let time_str = time_arr.join(',');
                item.merchants_goods_available_time=week_str+' '+time_str;
              }
            });
          })
        },
        wxQRCode(){
          let that = this;
          function callback(){
            that.alert_show=true;
            that.alert_content='已核销';
            that.getUserInfo(this.user_id);
            that.getOrderList();
          }
          function errorBack(msg){
            that.alert_show=true;
            that.alert_content=msg;
            that.getUserInfo(this.user_id);
            that.getOrderList();
          }
          wxQRCode(callback,errorBack)
        },
        redirect(){
          console.log(location.href)
        }
      },
      created(){
        this.redirect();
        this.getOrderList();
        this.$store.commit('selectedTab',{tab_index:0});
        this.$store.commit('userOrMerchant',{is_merchant:true});
      }
    }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";
  #merchant_home{
    padding: 90px 0;
    .head_content{
      padding: 27px 30px 7px 32px;
      .left_box{
        padding-top: 6px;
      }
      .right_box{
        position: relative;
        width: 202px;
        height: 163px;
        background-color: @bg-d;
        border-radius: 12px;
        .QR_code{
          width: 100px;
          height: 100px;
        }
      }
    }
    .time{
      margin-bottom: 27px;
    }
    .orderList{
      width: 689px;
      padding: 20px 0 0 0;
      margin: 0 auto;
      .order_item{
        display: flex;
        width: 100%;
        padding: 25px 20px;
        background-color: @bg-c;
        box-shadow: 0 0 15px 0
        rgba(0, 1, 1, 0.05);
        .mixin-borderRadius(12px);
        margin-bottom: 8px;
        .left_box{
          width: 60px;
          .head_box{
            width: 44px;
            height: 44px;
            .mixin-borderRadius(50%);
            overflow: hidden;
          }
        }
        .info_block{
          flex: 1;
          .order_info{
            padding-bottom: 14px;
            margin-bottom: 16px;
            border-bottom: 1px solid @border_a;
            .user_line{
              .user_name{
                margin-right: 24px;
              }
            }
            .under_line{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .phone_num{
                padding: 12px 0 10px 0;
              }
              .write_off{
                width: 89px;
                height: 44px;
                background-color: @sign_bg;
                border: none;
                .mixin-borderRadius(6px);
              }
              .write_over{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 142px;
                height: 55px;
                border: none;
                background-color: @btn_bg1;
                .mixin-borderRadius(6px);
              }
            }
          }
          .good_block{
            display: flex;
            .good_img{
             margin-top: 6px;
              padding-right: 18px;
              .img_box{
                width: 97px;
                height: 96px;
              }
            }
            .good_info{
              position: relative;
              flex: 1;
              .mark{
                right: -20px;
              }
              .price_block {
                display: flex;
                justify-content: space-between;
                span {
                  position: relative;
                  em {
                    background: linear-gradient(to bottom, #fff 0%, #fff 28%, @Y2 30%, @Y2 100%);
                    padding-left: 2px;
                    padding-right: 6px;
                  }
                  .p-original {
                    padding-left: 12px;
                  }
                }
              }
              .time_slot{
                width: 420px;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  #merchant_home{
    .vux-tab-wrap{
      height: 50px;
      .vux-tab-container{
        width: 499px;
        height: 50px;
        .vux-tab{
          height: 50px;
          background-color: transparent;
          .vux-tab-item{
            background: transparent;
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
