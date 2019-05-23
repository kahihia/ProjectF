<template>
  <div class="shopdetail">
    <head_bar :backLast="back_last" :tab_c="tab_c" :head="head" :showImg="showImg"></head_bar>
    <div class="banner">
      <swiper auto height="364px" dots-position="center">
        <swiper-item v-for="(item,index) in  listImg" class="swiper-demo-img" :key="index">
          <img style="width: 100%" :src="imgUrl(item)">
        </swiper-item>
      </swiper>
    </div>
    <div class="detail-a borderBox">
      <div class="name margin34">
        <span class="t-b name-a">{{shopDetailList.merchants_name}}</span>
        <span class="c-b mixin-right">{{$route.query.distance}}</span>
      </div>
      <div class="evaluate margin28">
        <img v-for="i in shopDetailList.merchants_comments_star_level" src="../../assets/images/icon/icon_star.png"/>
        <span class="c-b">{{shopDetailList.merchants_comments_count}}评价</span>
      </div>
      <div class="time margin28">
        <div class="time-a time-icon c-a">{{shopDetailList.merchants_inputtime}}</div>
        <div class="time-a address c-a">{{shopDetailList.merchants_address}}</div>
        <div class="chat">
          <a :href="'tel:' +  shopDetailList.merchants_phone">
            <span>
              <img class="mixin-center" src="../../assets/images/detail/icon_phone.png"/>
            </span>
          </a>
          <span>
            <img class="mixin-center" src="../../assets/images/detail/icon_Msg.png"/>
          </span>
        </div>
      </div>
    </div>
    <div class="point  c-a borderBox">
      <!--<span>10 points </span><em class="coupon">-￥10</em>-->
      <span class="c-b mixin-right piont-detail" @click="show_voucher=true">查看详情</span>
    </div>
    <div class="group borderBox c-a">商店的热销</div>
    <!--商品-->
    <div class="group-good">
      <div class="good-item clearfix" v-for="(item,index) in goodsList" @click="toGoodDetail(item.id,item.distance)">
        <div class="good-img _left">
          <img class="mixin-img" :src="imgUrl(item.merchants_goods_img[0])"/>
        </div>
        <div class="good-txt _left">
          <div class="name ellipsis t-b-b">
            {{item.merchants_goods_name}}
            <!--<em class="c-b">22m</em>-->
          </div>
          <div class="evaluate ellipsis">
            <img v-for="i in item.merchants_goods_comments_star_level" src="../../assets/images/icon/icon_star.png"/>
            <i class="c-b ">{{item.merchants_goods_comments_number}}评价</i>
            <em>hot</em>
          </div>
          <div class="shop-name c-a ellipsis">
            {{item.merchants_name}}
          </div>
          <div class="time c-a ellipsis">
            {{item.merchants_goods_available_time}}
            <!--<span>最后一天</span>-->
          </div>
          <div class="c-c price">
            <div class="left-txt">
              <span class="t-b">
                ￥<em class="c-Ba">{{item.merchatns_goods_platform_discount_price}}</em>
              </span>
              <em class="p-original">原价 ￥{{item.merchatns_goods_platform_price}}</em>
            </div>
            <div class="right-sold c-b">已售{{item.merchants_goods_sold}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--优惠券列表-->
    <div class="voucher_wrap" v-transfer-dom>
      <popup v-model="show_voucher" position="bottom" max-height="50%">
        <div class="head_title">
          <p class="title t-b">优惠详情
            <span @click="show_voucher=false" class="mixin-right"><img src="../../assets/images/icon/close.png"></span>
          </p>
        </div>
        <div class="voucher-list">
          <div class="null_wrap c-b" v-if="coupon_list.length===0">{{coupon_data.message}}</div>
          <div class="voucher-item" v-for="(item,index) in coupon_list" :style="'background:url('+item.catCoupon_img+') no-repeat 50% 50% ;color:'+item.coupon_color+';'">
            <div class="item-left">
              <div class="left_wrap">
                <p class="coupon_name">{{item.coupons_name}}</p>
                <ul class="condition">
                  <li>满{{item.use_standard}}使用</li>
                  <li>{{item.merchants_name}}</li>
                </ul>
                <p class="overtime">使用期限：{{item.starttime}}-{{item.overtime}}</p>
              </div>
              <div class="right_wrap">
                <em v-if="item.type==1">￥ <i class="numFs">{{item.discount}}</i></em>
                <em v-if="item.type==2"><i class="numFs">{{Number(item.discount)}}</i>折</em>
              </div>
            </div>
            <div class="item-right" @click="receiveCoupon(item.id)" v-if="item.is_receive==0">领取</div>
            <div class="item-right c-b" v-else>已领取</div>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import {getGreatCircleDistance} from '@/utils/utils'
  import request from '@/utils/request';
  import {formatDateTime} from '@/utils/format';
  import {getLocalPosition} from '@/utils/storages';
  import {Swiper, SwiperItem, Scroller, LoadMore,Popup,TransferDomDirective as TransferDom} from 'vux'
  import head_bar from '@/components/head_bar'
  export default {
    name: "goodsdetail",
    directives: {TransferDom},
    components: {Swiper, SwiperItem, Scroller, LoadMore, head_bar,Popup},
    data() {
      return {
        tab_c: true,
        back_last: true,
        head: '',
        showImg: false,
        listImg: [],
        shopDetailList: {},
        merchantId: this.$route.query.merchant_id,
        user_id: JSON.parse(localStorage.getItem('user_info')).id,
        timeStamp:formatDateTime(new Date()),
        goodsList: [],
        coupon_list: [],
        coupon_data: [],
        show_voucher: false,
        bgColor:[
          {id:'0',img:require('@/assets/images/common/currency.png'),color:'#dac901'},
          {id:'1137',img:require('@/assets/images/common/eatDrink.png'),color:'#f0614c'},
          {id:'1138',img:require('@/assets/images/common/palyer.png'),color:'#a45af5'},
          {id:'1139',img:require('@/assets/images/common/sport.png'),color:'#16d37d'},
          {id:'1140',img:require('@/assets/images/common/travel.png'),color:'#3884eb'}
        ]
      }
    },
    methods: {
      merchantsInfo() {
        let that = this;
        let params = {
          id: String(that.merchantId),
          user_id: String(that.user_id),
          timeStamp: formatDateTime(new Date())
        };
        request.merchantsInfo(params).then(({data}) => {
          that.listImg = data.data.merchants_img.split(",");
          that.head = data.data.merchants_name;
          that.shopDetailList = data.data;
        })
      },
      getGoodsList(){
        let that = this;
        let params = {
          is_merchants_get:String(0),
          merchants_goods_merchants_id:String(this.merchantId),
          timeStamp: this.timeStamp,
        };
        request.getGoodslist(params).then(res => {
          let resData = res.data;
          let goods_list=res.data.data;
          if(res.data.code==200){
            goods_list.map((item,index)=>{
              // 距离
              getLocalPosition('position')?item.distance = getGreatCircleDistance(getLocalPosition('position').lat,
                getLocalPosition('position').lng,item.merchants_latitude, item.merchants_longitude):item.distance='';
              // 图片
              item.merchants_goods_img = item.merchants_goods_img.split(",");
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
          }else {
            this.goods_data = resData;
          }
          that.goodsList=goods_list;
        })
      },
      //获取优惠券列表
      getMerchantsCoupons(){
        let that = this;
        let params={user_id:that.user_id,merchants_id:that.merchantId,timeStamp: that.timeStamp};
        request.getMerchantsCoupons(params).then(res=>{
          this.coupon_list = res.data.data;
          this.coupon_data = res.data;
          if(that.coupon_list.length>0){
            that.coupon_list.forEach((val,key)=>{
              that.bgColor.forEach((item,index)=>{
                if(val.usable_goods_category_id===item.id){
                  val.catCoupon_img=item.img;
                  val.coupon_color=item.color;
                }
              })
            });
          }
        })
      },
      receiveCoupon(coupon_id){
        let that = this;
        let params={
          user_id:that.user_id,
          merchants_coupons_id:coupon_id,
          timeStamp:that.timeStamp
        };
        request.userReceiveCoupons(params).then(res=>{
          this.noticeMsg=res.data.message;
          this.show_notice=true;
        })
      },
      //跳转商品详情
      toGoodDetail(good_id,distance){
        this.$router.push({path:'/goodsdetail',query:{good_id:good_id,distance:distance}})
      },
      toChat(){
        let that = this;
        let shopImgArr = that.shopDetailList.merchants_img.split(',');
        that.$router.push({
          path:'/chatIn',
          query:{
            to_nickname:that.shopDetailList.merchants_name,//接收者昵称
            urlImg:shopImgArr[0],//接收者头像
            to_username:that.shopDetailList.merchants_admin_phone,//接收者用户名
          }
        })
      },
    },
    created(){
    },
    mounted() {
      this.merchantsInfo();
      this.getGoodsList();
      this.getMerchantsCoupons();
      this.$store.commit('updateBottomNav', {showBottomNav: false})
    },
    destroyed() {
      this.$store.commit('updateBottomNav', {showBottomNav: true})
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/reset";

  .shopdetail {
    position: relative;
    width: 100%;
    padding-bottom: 100px;
    background: @bg-b;
    min-height: 100%;
    padding-bottom: 90px;
    .scroller-a {
      height: calc(100% - -90px) !important;
      width: 100%;
    }
    .margin34 {
      margin: 20px 22px 16px 34px;
    }
    .margin28 {
      margin: 20px 22px 16px 28px;
    }
    .banner {
      width: 100%;
      height: 364px;
      background: #ffe035;
    }
    .detail-a {
      .name {
        position: relative;
        .name-a {
          font-size: 30px;
        }
      }
      .evaluate {
        img {
          margin-left: 4px;
        }
        &:first-child {
          margin-left: 0;
        }
      }
      .time {
        border-bottom: 1px solid #dde1e7;
        position: relative;
        margin-bottom: 0;
        .time-a {
          padding-left: 42px;
          position: relative;
          &::before {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            content: '';
            width: 28px;
            height: 28px;
          }
        }
        .time-icon {
          margin-top: 22px;
          &::before {
            background: url("../../assets/images/detail/icon_timie.png") no-repeat center;
          }
        }
        .address {
          margin-top: 14px;
          margin-bottom: 18px;
          &::before {
            height: 30px;
            background: url("../../assets/images/detail/icon_pos.png") no-repeat center;
          }
        }
        .chat {
          position: absolute;
          right: 0;
          top: 0;
          width: 190px;
          /*height: 76px;*/
          display: flex;
          justify-content: space-around;
          align-content: center;
          span {
            display: block;
            width: 72px;
            height: 72px;
            overflow: hidden;
            background: @G1;
            .mixin-borderRadius(50%);
            position: relative;
          }
        }
      }

    }
    .point {
      position: relative;
      padding: 30px 0;
      margin-left: 28px;
      margin-right: 22px;
      border-bottom: 1px solid #dde1e7;
      padding-left: 78px;
      .coupon {
        display: inline-block;
        width: 60px;
        border: 2px solid @hot;
        .mixin-borderRadius(4px);
        color: @hot;
        font-size: 18px;
        text-align: center;
        margin-left: 8px;
        padding: 4px 0;
      }
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        content: '';
        width: 50px;
        height: 30px;
        background: url("../../assets/images/detail/icon_coupon.png") no-repeat center;

      }
      .piont-detail {
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .group {
      margin: 18px 28px;
      position: relative;
      padding-left: 32px;
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        content: '';
        width: 50px;
        height: 30px;
        /*background: url("../../assets/images/detail/icon_coupon.png") no-repeat center;*/

      }
    }
    /*商品*/
    .group-good {
      padding: 0 32px;
      margin-bottom: 36px;
      .good-item {
        width: 100%;
        background: @bg-c;
        padding: 24px;
        .mixin-borderRadius(12px);
        margin-bottom: 8px;
        .good-img {
          display: block;
          width: 170px;
          height: 170px;
          margin-right: 20px;
        }
        .good-txt {
          width: calc(100% - 190px);
          position: relative;
          .name {
            width: 80%;
            padding-bottom: 4px;
            em {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          .evaluate {
            padding-bottom: 6px;
            position: relative;
            padding-right: 68px;
            img {
              margin-left: 4px;
              &:first-child {
                margin-left: 0px;
              }
            }
            em {
              position: absolute;
              right: 0;
              top: 0;
              display: block;
              width: 62px;
              background: @hot;
              color: @bg-c;
              font-size: 18px;
              text-align: center;
              padding: 6px 0;
            }
          }
          .shop-name {
            padding-bottom: 4px;
          }
          .time {
            padding-bottom: 8px;
            span {
              color: @sign;
              border: 1px solid @sign;
              padding: 2px;
              .mixin-borderRadius(4px);
            }
          }
          .price {
            position: relative;
            .left-txt {
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
            .right-sold {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }

    }

  }
</style>
